import { treaty } from "@elysiajs/eden";
import { createEdenQueryHelpers } from "@elysia-vue-query/vue";
import type { App } from "@playground/api";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const client = treaty<App>(apiBaseUrl);
export const eden = createEdenQueryHelpers(client);
