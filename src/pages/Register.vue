<script setup>
import { register } from '@/services/authService';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');

async function submitRegister() {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Паролите не съвпадат!';
    return;
  }
  try {
    const result = await register({
      email: email.value,
      password: password.value,
    });
    console.log('Registration successful:', result);
    // тук можеш да пренасочиш към login или dashboard
  }
  catch (err) {
    errorMsg.value = err.message || 'Registration failed';
  }
}
</script>

<template>
  <div class="auth-container">
    <h2>Register</h2>
    <form class="auth-form" @submit.prevent="submitRegister">
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required>
      <p v-if="errorMsg" class="error">
        {{ errorMsg }}
      </p>
      <button type="submit">
        Register
      </button>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  background: #DEE1DD;
  padding: 24px;
  max-width: 350px;
  margin: 40px auto;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
input {
  padding: 10px;
  border: 1px solid #99AEAD;
  border-radius: 6px;
}
button {
  background: #658B6F;
  border: none;
  color: white;
  padding: 10px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #2F575D;
}
.error {
  color: red;
  font-size: 0.9em;
}
</style>
