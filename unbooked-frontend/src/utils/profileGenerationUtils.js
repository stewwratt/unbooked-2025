/**
 * Calls the AI service to generate a skeleton profile based on user description
 * @param {string} description - The business description provided by the user
 * @returns {Promise<Object>} - The skeleton profile data
 */
export async function generateSkeletonProfile(description) {
    try {
        // TODO: Replace with actual API endpoint
        const response = await fetch('/api/ai/skeleton-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error generating skeleton profile:', error);
        throw error;
    }
}

// For testing/development, use this mock function
export async function mockGenerateSkeletonProfile(description) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Generating profile from description:', description);

    // Return mock data
    return {
        businessInfo: {
            name: "SharpCuts Barbershop",
            address: "123 Main Street, Anytown, USA",
            phone: "555-123-4567"
        },
        services: [
            { name: "Haircut", duration: 30, price: 25 },
            { name: "Beard Trim", duration: 15, price: 15 },
            { name: "Haircut & Beard Combo", duration: 45, price: 35 }
        ],
        availability: {
            monday: ["09:00", "17:00"],
            tuesday: ["09:00", "17:00"],
            wednesday: ["09:00", "17:00"],
            thursday: ["09:00", "17:00"],
            friday: ["09:00", "17:00"],
            saturday: null,
            sunday: null
        }
    };
} 