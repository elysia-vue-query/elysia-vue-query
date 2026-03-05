<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Overview</h1>
      <p class="page-desc">
        This playground demonstrates <strong>elysia-vue-query</strong> inside Nuxt with
        automatic SSR hydration, type-safe queries, and zero-config cache invalidation.
      </p>
    </div>

    <!-- Stats -->
    <div class="grid-3 section">
      <div class="stat-card">
        <div class="stat-label">Users</div>
        <div class="stat-value">{{ users?.length ?? '—' }}</div>
        <div class="stat-sub">from <code>eden.proxy.users.get</code></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Posts</div>
        <div class="stat-value">{{ posts?.length ?? '—' }}</div>
        <div class="stat-sub">from <code>eden.proxy.posts.get</code></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">API Status</div>
        <div class="stat-value" style="display:flex;align-items:center;gap:10px">
          <span class="status-dot" :class="apiOnline ? 'status-dot--success' : 'status-dot--error'" />
          <span style="font-size:20px">{{ apiOnline ? 'Online' : 'Offline' }}</span>
        </div>
        <div class="stat-sub">localhost:3000</div>
      </div>
    </div>

    <!-- Features -->
    <h2 class="card-title section" style="margin-bottom:0"><span class="icon">✨</span> What's powering this</h2>
    <div class="grid-3 section" style="margin-top:16px">
      <div class="feature-card">
        <div class="feature-icon feature-icon--purple">🔑</div>
        <div class="feature-name">Auto Query Keys</div>
        <div class="feature-desc">
          Keys derived from route structure.
          <code>eden.proxy.users.get</code> becomes
          <code>[Symbol, 'users', 'get']</code>.
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon feature-icon--green">🔄</div>
        <div class="feature-name">Smart Invalidation</div>
        <div class="feature-desc">
          <code>users.post</code> mutation auto-invalidates all
          <code>users.*</code> queries. No keys to remember.
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon feature-icon--amber">🌍</div>
        <div class="feature-name">SSR Hydration</div>
        <div class="feature-desc">
          Nuxt module dehydrates query cache on server, hydrates on client. Zero flicker.
        </div>
      </div>
    </div>

    <!-- Code example -->
    <div class="card section">
      <div class="card-title"><span class="icon">📄</span> How it looks in a component</div>
      <div class="code-block"><span class="cm">// composables/eden.ts</span>
<span class="kw">import</span> { treaty } <span class="kw">from</span> <span class="str">'@elysiajs/eden'</span>
<span class="kw">import</span> { createEdenQueryHelpers } <span class="kw">from</span> <span class="str">'@elysia-vue-query/vue'</span>
<span class="kw">import type</span> { App } <span class="kw">from</span> <span class="str">'@playground/api'</span>

<span class="kw">const</span> client = <span class="fn">treaty</span><span class="op">&lt;</span>App<span class="op">&gt;</span>(<span class="str">'http://localhost:3000'</span>)
<span class="kw">export const</span> eden = <span class="fn">createEdenQueryHelpers</span>(client)

<span class="cm">// In your component — fully typed, zero boilerplate</span>
<span class="kw">const</span> { <span class="prop">data</span>: users } = eden.<span class="fn">useQuery</span>(eden.proxy.users.get)
<span class="kw">const</span> mutation = eden.<span class="fn">useMutation</span>(eden.proxy.users.post)

<span class="cm">// Create a user → users.get auto-refetches ✨</span>
mutation.<span class="fn">mutate</span>({ <span class="prop">name</span>: <span class="str">'Alice'</span>, <span class="prop">email</span>: <span class="str">'alice@example.com'</span> })</div>
    </div>

    <!-- Recent data preview -->
    <div class="grid-2 section">
      <div class="card">
        <div class="card-title"><span class="icon">👤</span> Latest Users</div>
        <div v-if="usersStatus === 'pending'" class="loading">
          <div class="spinner" />
          Loading…
        </div>
        <div v-else-if="usersStatus === 'error'" class="error-box">Failed to fetch users</div>
        <div v-else class="row-list">
          <div v-for="user in users?.slice(-3).reverse()" :key="user.id" class="row-item">
            <div class="avatar">{{ user.name.charAt(0) }}</div>
            <div class="row-info">
              <div class="row-name">{{ user.name }}</div>
              <div class="row-meta">{{ user.email }}</div>
            </div>
            <span class="row-badge badge-id">#{{ user.id }}</span>
          </div>
          <div v-if="!users?.length" class="empty">
            <div class="empty-text">No users yet</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="icon">📝</span> Latest Posts</div>
        <div v-if="postsStatus === 'pending'" class="loading">
          <div class="spinner" />
          Loading…
        </div>
        <div v-else-if="postsStatus === 'error'" class="error-box">Failed to fetch posts</div>
        <div v-else class="row-list">
          <div v-for="post in posts?.slice(-3).reverse()" :key="post.id" class="row-item">
            <div class="row-info">
              <div class="row-name">{{ post.title }}</div>
              <div class="row-meta" style="display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden">{{ post.body }}</div>
            </div>
            <span class="post-author-badge">user:{{ post.userId }}</span>
          </div>
          <div v-if="!posts?.length" class="empty">
            <div class="empty-text">No posts yet</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { eden } from '~/composables/eden'

const { data: users, status: usersStatus } = eden.useQuery(eden.proxy.users.get)
const { data: posts, status: postsStatus } = eden.useQuery(eden.proxy.posts.get)

const apiOnline = computed(() => usersStatus.value !== 'error' && postsStatus.value !== 'error')
</script>
