<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Posts</h1>
      <p class="page-desc">
        Browse and create posts. Creating a post auto-invalidates the posts list via route-hierarchy cache busting.
      </p>
    </div>

    <!-- Create Post Form -->
    <div class="card section">
      <div class="card-title">
        <span class="icon">✏️</span>
        New Post
        <span class="tag tag--mutation" style="margin-left:auto;font-size:11px">useMutation</span>
      </div>
      <form class="create-form" @submit.prevent="handleCreate">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input
              v-model="title"
              class="form-input"
              type="text"
              placeholder="My Awesome Post"
              required
              :disabled="createMutation.isPending.value"
            >
          </div>
          <div class="form-group">
            <label class="form-label">Author (User ID)</label>
            <select
              v-model.number="userId"
              class="form-input"
              required
              :disabled="createMutation.isPending.value"
            >
              <option :value="0" disabled>Select a user…</option>
              <option v-for="user in usersList" :key="user.id" :value="user.id">
                {{ user.name }} (#{{ user.id }})
              </option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top:12px">
          <label class="form-label">Body</label>
          <textarea
            v-model="body"
            class="form-input"
            rows="3"
            placeholder="Write something interesting…"
            required
            :disabled="createMutation.isPending.value"
            style="resize:vertical"
          />
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-top:16px">
          <button type="submit" class="btn btn-primary" :disabled="createMutation.isPending.value || !userId">
            {{ createMutation.isPending.value ? 'Publishing…' : 'Publish Post' }}
          </button>
          <Transition name="fade">
            <span v-if="showSuccess" class="success-box" style="padding:8px 14px;font-size:13px">
              ✓ Post published!
            </span>
          </Transition>
        </div>
      </form>
    </div>

    <!-- Posts Grid -->
    <div class="section">
      <div class="card-title" style="margin-bottom:16px">
        <span class="icon">📝</span>
        All Posts
        <span class="tag tag--query" style="margin-left:8px;font-size:11px">useQuery</span>
      </div>

      <div v-if="postsStatus === 'pending'" class="loading">
        <div class="spinner" />
        Fetching posts…
      </div>

      <div v-else-if="postsStatus === 'error'" class="error-box">
        Failed to load posts
      </div>

      <div v-else-if="posts && posts.length > 0" class="posts-grid">
        <div v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-title">{{ post.title }}</div>
          <p class="post-body">{{ post.body }}</p>
          <div class="post-footer">
            <span class="post-author-badge">{{ getUserName(post.userId) }}</span>
            <span class="row-badge badge-id">post #{{ post.id }}</span>
          </div>
        </div>
      </div>

      <div v-else class="empty">
        <div class="empty-icon">📝</div>
        <div class="empty-text">No posts yet — write the first one!</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { eden } from '~/composables/eden'

const title = ref('')
const body = ref('')
const userId = ref(0)
const showSuccess = ref(false)
let successTimeout: ReturnType<typeof setTimeout> | null = null

const { data: posts, status: postsStatus } = eden.useQuery(eden.proxy.posts.get)
const { data: usersList } = eden.useQuery(eden.proxy.users.get)

const createMutation = eden.useMutation(eden.proxy.posts.post)

function getUserName(id: number): string {
  const user = usersList.value?.find(u => u.id === id)
  return user ? user.name : `user:${id}`
}

function handleCreate() {
  if (!title.value.trim() || !body.value.trim() || !userId.value) return

  createMutation.mutate(
    {
      title: title.value.trim(),
      body: body.value.trim(),
      userId: userId.value,
    },
    {
      onSuccess: () => {
        title.value = ''
        body.value = ''
        userId.value = 0
        showSuccess.value = true
        if (successTimeout) clearTimeout(successTimeout)
        successTimeout = setTimeout(() => {
          showSuccess.value = false
        }, 3000)
      },
    },
  )
}
</script>

<style scoped>
.create-form {
  max-width: 560px;
}

.posts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 700px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
