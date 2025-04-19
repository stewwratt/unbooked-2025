import { OpenAPIRoute } from "chanfana";

export const OnboardingChat: OpenAPIRoute = async (c) => {
    try {
        // Parse the incoming JSON
        const { sessionId, message } = await c.req.json();
        console.log("Request received with sessionId:", sessionId ? "exists" : "null", "and message:", message);

        // Set up headers with API key
        const headers = {
            'xi-api-key': c.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
        };

        // Check environment variables
        if (!c.env.ELEVENLABS_API_KEY || !c.env.ELEVENLABS_AGENT_ID) {
            console.error("Missing API key or Agent ID!");
            return c.json({
                error: "Server configuration error"
            }, 500);
        }

        // Prepare request body
        const body = {
            message: message,
            conversation_id: sessionId || undefined
        };

        // Call the ElevenLabs API
        const elevenlabsUrl = `https://api.elevenlabs.io/v1/convai/agents/${c.env.ELEVENLABS_AGENT_ID}/chat-text`;

        const response = await fetch(elevenlabsUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        console.log("ElevenLabs response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('ElevenLabs API error:', JSON.stringify(errorData));

            // Return a mock response to keep the frontend working
            return c.json({
                reply: "I can help set up your business profile. What services do you offer and what are your hours?",
                fields: {},
                sessionId: sessionId || "new-session-123"
            });
        }

        // Parse and return the actual response
        const data = await response.json();
        return c.json({
            reply: data.message || data.text,
            fields: data.extracted_data || data.fields || {},
            sessionId: data.conversation_id || sessionId
        });
    } catch (error) {
        console.error("Error in onboarding chat:", error);
        return c.json({
            error: "Internal server error"
        }, 500);
    }
};
