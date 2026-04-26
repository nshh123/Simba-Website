const Groq = require('groq-sdk');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

async function main() {
  const productsData = JSON.parse(fs.readFileSync('./data/simba_products.json', 'utf8'));
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
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

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: "do you have milk" },
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
    });

    console.log("Raw Response:");
    console.log(chatCompletion.choices[0]?.message?.content);
  } catch(e) {
    console.error("Error:", e);
  }
}
main();
