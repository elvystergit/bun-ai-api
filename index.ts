import { cerebrasService } from "./services/cerebras";
import { deepseekService } from "./services/deepseek";
import { groqService } from "./services/groq";
import type { AIService, ChatMessage } from "./types";

const services: AIService[] = [groqService,
cerebrasService,
deepseekService
]
let currentServiceIndex = 0;

//balancear entre servicios en cada solicitud
function getNextService() {
    const service = services[currentServiceIndex];
    currentServiceIndex = (currentServiceIndex + 1) % services.length;
    return service;
}

//Servidor Bun para manejar solicitudes de chat y transmitir respuestas
const server = Bun.serve({
    port: process.env.PORT ?? 3000,
    async fetch(req) {
        const { pathname } = new URL(req.url)

// Manejar solicitudes POST a /chat y transmitir respuestas de AI services        
if (req.method === 'POST' && pathname === '/chat') {
    const { messages } = await req.json() as { messages: ChatMessage[] };
    const service = getNextService();

    console.log(`Using service: ${service?.name} service for this request.`);
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

console.log(`Server running on ${server.hostname}:${server.port}`);