import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import productsData from '@/data/simba_products.json';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const currentApiKey = process.env.GROQ_API_KEY;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!currentApiKey) {
      return NextResponse.json({
        matchedProductIds: [],
        error: 'No API Key'
      });
    }

    const groq = new Groq({ apiKey: currentApiKey.trim() });

    const systemPrompt = `
      You are an AI semantic search engine for Simba Supermarket.
      Your task is to map the user's search query to relevant product IDs from our catalog.
      
      Our product catalog:
      ${JSON.stringify(productsData.products.map(p => ({ id: p.id, name: p.name, description: p.description, category: p.category })), null, 2)}
      
      Rules:
      1. This is a conversational search interface. Users might type conversational queries like "do you have milk", "I want something completely spicy", or "what is good for a hangover".
      2. Extract the core intent or entities from the user's message (e.g., "do you have milk" -> "milk").
      3. Map that intent to the most relevant product IDs in our catalog.
      4. Max 10 items. Prioritize exact item names, then semantic/intent matches.
      5. If no products are relevant, return an empty array.
      6. ALWAYS return a JSON response with the following structure:
         {
           "matchedProductIds": ["prod-001", "prod-002"] 
         }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from Groq');
    }

    const parsedContent = JSON.parse(content);
    const matchedProducts = (parsedContent.matchedProductIds || []).map((id: string) => 
      productsData.products.find(p => p.id === id)
    ).filter(Boolean);

    return NextResponse.json({
      matchedProducts
    });
  } catch (error: any) {
    console.error('Groq Search API Error:', error);
    return NextResponse.json({ 
      matchedProducts: [],
    }, { status: 500 });
  }
}
