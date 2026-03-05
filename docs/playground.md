# Playground

Runnable playgrounds are included in the repository to demonstrate the library in action — a vanilla Vue app and a Nuxt app with SSR.

## Running the Playground

### 1. Start the API Server

```bash
bun run playground:api
```

This starts an Elysia server at `http://localhost:3000` with the following endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/users` | List all users |
| `GET` | `/users/:id` | Get user by ID |
| `POST` | `/users` | Create a user |
| `DELETE` | `/users/:id` | Delete a user |
| `GET` | `/users/:id/posts` | Get posts by user |
| `GET` | `/posts` | List all posts |
| `POST` | `/posts` | Create a post |

### 2a. Start the Vue App

```bash
bun run playground:vue
```

This starts a Vite dev server (typically at `http://localhost:5173`) with a Vue 3 app that demonstrates:

- **`useQuery`** — fetching users and posts with auto-generated keys
- **`useMutation`** — creating users with automatic cache invalidation
- **Type inference** — all data types inferred from the Elysia API
- **Loading & error states** — proper handling via TanStack Query

### 2b. Start the Nuxt App

```bash
bun run playground:nuxt
```

This starts a Nuxt dev server that demonstrates everything above *plus*:

- **SSR hydration** — queries prefetched on the server, hydrated on the client
- **`@elysia-vue-query/nuxt` module** — auto-imports and VueQueryPlugin registration
- **Page-based routing** — overview dashboard, users CRUD, and posts listing
- **Auto-import** — `createEdenQueryHelpers` available without explicit imports

## Playground Structure

```
playground/
├── api/                  # Elysia backend server
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts      # CRUD endpoints, exports `type App`
├── vue-app/              # Vue 3 + Vite consumer app
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.ts       # Vue app + VueQueryPlugin setup
│       ├── App.vue       # Layout shell
│       ├── lib/
│       │   └── eden.ts   # createEdenQueryHelpers setup
│       └── components/
│           ├── UserList.vue    # useQuery example
│           ├── CreateUser.vue  # useMutation example
│           └── PostList.vue    # useQuery example
└── nuxt-app/             # Nuxt 3 consumer app with SSR
    ├── package.json
    ├── nuxt.config.ts    # @elysia-vue-query/nuxt module config
    ├── app.vue           # Layout with sidebar nav
    ├── composables/
    │   └── eden.ts       # createEdenQueryHelpers setup
    ├── pages/
    │   ├── index.vue     # Dashboard overview
    │   ├── users.vue     # Users CRUD (useQuery + useMutation)
    │   └── posts.vue     # Posts listing + creation
    └── assets/
        └── css/
            └── main.css  # Application styles
```

## Key Patterns Demonstrated

### Query Setup (UserList.vue)

```vue
<script setup lang="ts">
import { eden } from '../lib/eden'

const { data: users, status, error } = eden.useQuery(
  eden.proxy.users.get
)
</script>
```

### Mutation with Auto-Invalidation (CreateUser.vue)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { eden } from '../lib/eden'

const name = ref('')
const email = ref('')

const mutation = eden.useMutation(eden.proxy.users.post)

function submit() {
  mutation.mutate(
    { name: name.value, email: email.value },
    { onSuccess: () => { name.value = ''; email.value = '' } }
  )
  // After success, all users.get queries automatically refetch ✨
}
</script>
```

### Nuxt Setup (composables/eden.ts)

```ts
import { treaty } from '@elysiajs/eden'
import { createEdenQueryHelpers } from '@elysia-vue-query/vue'
import type { App } from '@playground/api'

const client = treaty<App>('http://localhost:3000')
export const eden = createEdenQueryHelpers(client)
```

The `@elysia-vue-query/nuxt` module handles VueQueryPlugin registration and SSR hydration/dehydration automatically — no plugin file needed.
