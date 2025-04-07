import { Hono } from "hono";
import { fromHono } from "chanfana";
import { BookingCreate } from "./endpoints/bookingCreate";

const app = new Hono();
const openapi = fromHono(app, {
    docs_url: "/",
});

openapi.post("/api/bookings", BookingCreate);

export default app; 