import { z } from "zod";
import { Str } from "chanfana";

export const BookingSchema = z.object({
    id: Str(),
    userId: Str(),
    slotId: Str(),
    status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    stripePaymentIntentId: Str().optional(),
    price: z.number(),
}); 