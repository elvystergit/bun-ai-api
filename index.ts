const server = Bun.serve({
    port: process.env.PORT ?? 3000,
    async fetch(request) {
        return new Response("API de BUN funcionando perfectamente!");
    }
});

console.log(`Servidor corriendo en http://localhost:${server.port}`);