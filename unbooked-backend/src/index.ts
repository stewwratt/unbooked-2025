import { fromHono } from "chanfana";
import { Hono } from "hono";
import { OnboardingChat } from "./endpoints/onboardingChat";
import { cors } from 'hono/cors';

// Tell Hono about our environment vars
const app = new Hono<{
	Bindings: {
		ELEVENLABS_API_KEY: string;
		ELEVENLABS_AGENT_ID: string;
	};
}>();

// Middleware - allow CORS for development
app.use('*', cors({
	origin: ['http://localhost:3000', 'https://demo.unbooked.me'],
	allowMethods: ['POST', 'OPTIONS'],
	allowHeaders: ['Content-Type'],
	maxAge: 600,
	credentials: true,
}));

// Simple health check endpoint
app.get('/', (c) => c.text('✅ Unbooked-backend is up and running!'));

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/docs",
});

// Only register the onboarding chat endpoint
openapi.post("/api/onboardingchat", OnboardingChat);

// Export the Hono app
export default app;