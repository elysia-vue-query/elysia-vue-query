<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-logo">e</div>
        <span class="sidebar-title">elysia-vue-query</span>
      </div>

      <div class="sidebar-subtitle">Playground</div>

      <NuxtLink to="/" class="sidebar-link" :class="{ active: route.path === '/' }">
        <span class="icon">⚡</span>
        Overview
      </NuxtLink>

      <NuxtLink to="/users" class="sidebar-link" :class="{ active: route.path === '/users' }">
        <span class="icon">👤</span>
        Users
        <span v-if="usersCount !== null" class="sidebar-badge">{{ usersCount }}</span>
      </NuxtLink>

      <NuxtLink to="/posts" class="sidebar-link" :class="{ active: route.path === '/posts' }">
        <span class="icon">📝</span>
        Posts
        <span v-if="postsCount !== null" class="sidebar-badge">{{ postsCount }}</span>
      </NuxtLink>

      <div class="sidebar-footer">
        <p class="sidebar-footer-text">
          Powered by <strong>elysia-vue-query</strong><br>
          Eden Treaty + TanStack Query
        </p>
      </div>
    </aside>

    <main class="main">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { eden } from '~/composables/eden'

const route = useRoute()

const { data: users } = eden.useQuery(eden.proxy.users.get)
const { data: posts } = eden.useQuery(eden.proxy.posts.get)

const usersCount = computed(() => users.value?.length ?? null)
const postsCount = computed(() => posts.value?.length ?? null)
</script>
