import { GoogleGenerativeAI } from "@google/generative-ai";
import { PORTFOLIO_CONTEXT } from "../../../lib/portfolioContext";
import { fetchPortfolioData } from "../../../lib/fetchPortfolioData";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { message } = await req.json();

        // Fetch dynamic portfolio data from DB
        const { websites, creatives } = await fetchPortfolioData();

        let dynamicContext = "";
        if (websites && websites.length > 0) {
            dynamicContext += "\nWEBSITES PORTFOLIO:\n";
            websites.forEach(w => {
                dynamicContext += `- ${w.name}: ${w.description || 'No description'}\n`;
            });
        }
        if (creatives && creatives.length > 0) {
            dynamicContext += "\nCREATIVES PORTFOLIO:\n";
            creatives.forEach(c => {
                const creativeName = c.title || c.name || 'Creative Work';
                const creativeDesc = c.description ? `: ${c.description}` : '';
                dynamicContext += `- ${creativeName}${creativeDesc}\n`;
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a personal portfolio assistant.

Use this information:
${PORTFOLIO_CONTEXT}
${dynamicContext}

User question:
${message}
`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        return Response.json({ reply });

    } catch (error) {
        console.error("CHATBOT ERROR:", error);   // 👈 ADD THIS
        return Response.json({ reply: "Something went wrong." });
    }
}