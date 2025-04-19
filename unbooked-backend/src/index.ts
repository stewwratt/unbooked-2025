import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from 'hono/cors';

// Tell Hono about our environment vars
const app = new Hono<{
	Bindings: {
		ELEVENLABS_API_KEY: string;
		ELEVENLABS_AGENT_ID: string;
	};
}>();

// Middleware - allow CORS for your frontend
app.use('*', cors({
	origin: [
		'http://localhost:3000',            // Development
		'https://demo.unbooked.me' // Production domain
	],
	allowMethods: ['GET', 'POST', 'OPTIONS'],
	allowHeaders: ['Content-Type'],
	exposeHeaders: ['Content-Length'],
	maxAge: 600,
	credentials: true,
}));

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// src/index.ts
app.get('/', (c) => c.text('✅ Unbooked‑backend is up and running!'))

// Simple endpoint to get the agent ID - helps keep it secure
openapi.get("/api/elevenlabs-agent-id", (c) => {
	return c.json({
		agentId: c.env.ELEVENLABS_AGENT_ID
	});
});

// Export the Hono app
export default app;
