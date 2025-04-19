/**
 * Utility function to test ElevenLabs connection
 */
export async function testElevenLabsConnection() {
    const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8787";

    try {
        const res = await fetch(`${BASE}/api/onboardingchat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: null,
                message: "Test connection"
            })
        });

        const data = await res.json();
        console.log('ElevenLabs connection test result:', data);

        return {
            success: res.ok,
            data
        };
    } catch (error) {
        console.error('ElevenLabs connection test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
} 