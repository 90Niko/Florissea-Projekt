<script setup>
import { register } from '@/services/authService';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['close']); // важно: за да затворим модала

const router = useRouter();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');

async function submitRegister() {
  errorMsg.value = '';
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Паролите не съвпадат';
    return;
  }
  try {
    const { user, session } = await register(email.value, password.value);
    console.log('Register success', { user, session });

    // Ако имаш включено email confirmation, session може да е null:
    if (!session) {
      alert('Проверете имейла си за потвърждение.');
    }

    emit('close'); // ✅ затваряме модала
    router.push('/login'); // ✅ към Login
  }
  catch (err) {
    errorMsg.value = err.message || 'Registration failed';
  }
}
</script>

<template>
  <form class="auth-form" @submit.prevent="submitRegister">
    <input v-model="email" type="email" placeholder="Email" required>
    <input v-model="password" type="password" placeholder="Password" required>
    <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required>
    <p v-if="errorMsg" class="error">
      {{ errorMsg }}
    </p>
    <button type="submit" class="submit-btn">
      Register
    </button>
  </form>
</template>

<style scoped>
.auth-form { display:flex; flex-direction:column; gap:12px; }
input { padding:10px; border:1px solid #99AEAD; border-radius:6px; }
.submit-btn {
  background:#658B6F; border:none; color:#fff; padding:10px;
  font-weight:600; border-radius:6px; cursor:pointer; transition:background .3s ease;
}
.submit-btn:hover { background:#2F575D; }
.error { color:red; font-size:.9em; }
</style>
