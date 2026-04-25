import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import productsData from '@/data/simba_products.json';

const apiKey = process.env.GROQ_API_KEY;

// Fallback for demo purposes if key is missing, 
// though in production this should be a required env var.
const groq = apiKey ? new Groq({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!groq) {
      // Mock response if API key is missing
      console.warn('GROQ_API_KEY is missing. Returning mock response.');
      return NextResponse.json({
        response: "I'm sorry, I'm currently in demo mode and cannot connect to Groq. Please configure the GROQ_API_KEY.",
        matchedProductIds: []
      });
    }

    const systemPrompt = `
      You are a helpful assistant for Simba Supermarket.
      Your task is to help users find products from our catalog.
      
      Our product catalog:
      ${JSON.stringify(productsData.products.map(p => ({ id: p.id, name: p.name, description: p.description, price: p.price, category: p.category })), null, 2)}
      
      Rules:
      1. If a user asks for a product we have (e.g., "fresh milk"), recommend it and provide its details.
      2. If a user expresses a need (e.g., "something for breakfast"), suggest relevant items from the catalog.
      3. If we don't have exactly what they want, suggest the closest alternatives.
      4. Keep your response natural, short, and friendly.
      5. ALWAYS return a JSON response with the following structure:
         {
           "response": "Your natural language message here",
           "matchedProductIds": ["prod-001", "prod-002"] // List of IDs of products mentioned or relevant
         }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      model: 'llama-3.3-70b-versatile',
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
      response: parsedContent.response,
      matchedProducts
    });
  } catch (error) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ 
      response: "Sorry, I encountered an error while searching for products. Please try again later.",
      matchedProductIds: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
