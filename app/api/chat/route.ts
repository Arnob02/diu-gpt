import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const { ASTRA_DB_NAMESPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN, OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
    try {

        const { messages } = await req.json();
        const latestMessage = messages[messages?.length - 1]?.content;
        let docContext = "";


        // Generate embeddings for vector search
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float"
        });


        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION);
            const cursor = collection.find(null, {
                sort: { $vector: embedding.data[0].embedding },
                limit: 10
            });
            const documents = await cursor.toArray();
            const docsmap = documents?.map(doc => doc.text);
            docContext = JSON.stringify(docsmap);

        } catch (err) {
            console.error("Error querying database:", err); 
            docContext = "";
        }

        const template = {
            role: "system",
            content: `
            You are an AI assistant who knows everything about Daffodil International University (DIU).
            Use the below context to augment what you know about DIU.
            The context will provide you with the most recent page data from the DIU official website, Wikipedia, and other verified sources.

            If the context doesn't include the information you need, answer based on your existing knowledge.
            Do not mention the source of your information or whether the context does or doesn't include certain details.

            Format responses using markdown where applicable and don't return images.

            ------------------
            START CONTEXT
            ${docContext}
            END CONTEXT
            ------------------
            QUESTION:
            ${latestMessage}
            `
        };


        // Stream OpenAI response manually
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            stream: true,
            messages: [template, ...messages]
        });

        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const text = chunk.choices[0]?.delta?.content || "";
                        controller.enqueue(encoder.encode(text));
                    }
                } catch (err) {
                    console.error("Error streaming OpenAI response:", err);
                    controller.error(err);
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(readableStream, {
            headers: { "Content-Type": "text/plain" }
        });

    } catch (err) {
        console.error("Error processing request:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
