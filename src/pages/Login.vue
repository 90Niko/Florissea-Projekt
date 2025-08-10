<script setup>
import { login } from '@/services/authService';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['close']);

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref('');

async function submitLogin() {
  errorMsg.value = '';
  try {
    const result = await login(email.value, password.value);
    console.log('Login success', result);
    emit('close'); // 1) затвори модала
    router.push('/'); // 2) редирект към Home
  }
  catch (err) {
    errorMsg.value = err.message || 'Login failed';
  }
}
</script>

<template>
  <form class="auth-form" @submit.prevent="submitLogin">
    <input v-model="email" type="email" placeholder="Email" required>
    <input v-model="password" type="password" placeholder="Password" required>
    <p v-if="errorMsg" class="error">
      {{ errorMsg }}
    </p>
    <button type="submit" class="submit-btn">
      Login
    </button>
  </form>
</template>

<style scoped>
.auth-form { display:flex; flex-direction:column; gap:12px; }
input { padding:10px; border:1px solid #99AEAD; border-radius:6px; }
.submit-btn { background:#658B6F; border:none; color:#fff; padding:10px; font-weight:600; border-radius:6px; cursor:pointer; transition:background .3s; }
.submit-btn:hover { background:#2F575D; }
.error { color:red; font-size:.9em; }
</style>
