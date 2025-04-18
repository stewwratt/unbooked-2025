/**
 * Sends a message to the Nova AI assistant through the backend
 * @param {string} sessionId - The session ID for continuing conversations
 * @param {string} message - The user's message text
 * @returns {Promise<Object>} - Contains reply, fields, and sessionId
 */
export async function sendToNova(sessionId, message) {
    try {
        // In development, uses the proxy setting in package.json
        // In production, uses relative path to same-origin API
        const res = await fetch('/api/onboardingchat', {
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

