import { treaty } from "@elysiajs/eden";
import { createEdenQueryHelpers } from "@elysia-vue-query/vue";
import type { App } from "@playground/api";

const runtimeConfig = useRuntimeConfig();
const client = treaty<App>(runtimeConfig.public.apiBaseUrl);
export const eden = createEdenQueryHelpers(client);
