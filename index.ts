import { groqService } from "./services/groq";
import type { AIService, ChatMessage } from "./types";

const services: AIService[] = [groqService,
// Add other services here
]
let currentServiceIndex = 0;

//balancear entre servicios en cada solicitud
function getNextService() {
    const service = services[currentServiceIndex];
    currentServiceIndex = (currentServiceIndex + 1) % services.length;
    return service;
}

const server = Bun.serve({
    port: process.env.PORT ?? 3000,
    async fetch(req) {
        const { pathname } = new URL(req.url)

if (req.method === 'POST' && pathname === '/chat') {
    const { messages } = await req.json() as { messages: ChatMessage[] };
    const service = getNextService();
    const stream = await service?.chat(messages)


    return new Response(stream ,{
        headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    },
    });
}

return new Response('Not Found', { status: 404 });
    }
})

console.log(`Server running at http://localhost:${server.port}/`);