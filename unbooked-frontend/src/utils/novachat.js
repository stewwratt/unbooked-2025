/**
 * Sends a message to the Nova AI assistant through the backend
 * @param {string} sessionId - The session ID for continuing conversations (optional for first message)
 * @param {string} message - The user's message text
 * @returns {Promise<Object>} - Contains reply, fields, and sessionId
 */
export async function sendToNova(sessionId, message) {
    // Use environment variable for API base URL
    const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8787";

    try {
        const res = await fetch(`${BASE}/api/onboardingchat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, message })
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Error response from API:', data);
            throw new Error(data.error || `Nova API error: ${res.status}`);
        }

        return data; // { reply, fields, sessionId }
    } catch (error) {
        console.error('Error sending message to Nova:', error);
        throw error;
    }
} 