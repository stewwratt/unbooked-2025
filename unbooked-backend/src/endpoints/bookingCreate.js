import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { BookingSchema } from "../schemas/booking";

export class BookingCreate extends OpenAPIRoute {
    schema = {
        tags: ["Bookings"],
        summary: "Create a new booking",
        request: {
            body: z.object({
                slotId: Str({ description: "Time slot ID" }),
                userId: Str({ description: "User ID" }),
                price: z.number({ description: "Booking price" }),
            }),
        },
        responses: {
            "200": {
                description: "Returns the created booking",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                booking: BookingSchema,
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c) {
        const data = await this.getValidatedData();
        const { slotId, userId, price } = data.body;

        const booking = {
            id: crypto.randomUUID(),
            slotId,
            userId,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            price,
        };

        return {
            success: true,
            result: {
                booking,
            },
        };
    }
} 