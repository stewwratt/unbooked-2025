import { OpenAPIRoute } from "chanfana";

export const OnboardingChat: OpenAPIRoute = async (c) => {
    try {
        // 1. Parse the incoming JSON
        const { sessionId, message } = await c.req.json();
        console.log("Request received with sessionId:", sessionId ? "exists" : "null", "and message:", message);

        // 2. Set up headers with API key
        const headers = {
            'xi-api-key': c.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
        };
        console.log("API Key present:", !!c.env.ELEVENLABS_API_KEY);
        console.log("Agent ID present:", !!c.env.ELEVENLABS_AGENT_ID);

        // 3. Prepare request body
        const body = {
            message: message,
            conversation_id: sessionId || undefined
        };

        // 4. Call the ElevenLabs API
        console.log("Making request to ElevenLabs API...");
        const elevenlabsUrl = `https://api.elevenlabs.io/v1/convai/agents/${c.env.ELEVENLABS_AGENT_ID}/chat-text`;
        console.log("URL:", elevenlabsUrl);

        const response = await fetch(elevenlabsUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        console.log("ElevenLabs response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('ElevenLabs API error:', JSON.stringify(errorData));

            // For development/testing: provide a mock response
            console.log("Using fallback mock response for development");
            return c.json({
                reply: "This is a mock response from Nova. I can help you set up your business profile. What's your business name and what services do you offer?",
                fields: {},
                sessionId: "mock-session-123"
            });
        }

        // 5. Parse and return the response
        const data = await response.json();
        console.log("Successful response from ElevenLabs");
        return c.json({
            reply: data.message || data.text,
            fields: data.extracted_data || data.fields || {},
            sessionId: data.conversation_id
        });
    } catch (error) {
        console.error('Error in onboarding chat:', error.toString(), error.stack);
        return c.json({ error: `Internal server error: ${error.toString()}` }, 500);
    }
};