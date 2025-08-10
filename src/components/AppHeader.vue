<script setup>
import AuthModal from '@/components/AuthModal.vue'; // ✅ правилен импорт
import { ref } from 'vue';

const showAuthModal = ref(false);
const modalTab = ref('login');

function openAuth(tab) {
  modalTab.value = tab;
  showAuthModal.value = true;
}
</script>

<template>
  <nav class="navbarr">
    <ul class="main-links">
      <li>
        <router-link to="/">
          Home
        </router-link>
      </li>
      <li>
        <router-link to="/about">
          About
        </router-link>
      </li>
      <li>
        <router-link to="/contacts">
          Contacts
        </router-link>
      </li>
    </ul>
    <div class="auth-buttons">
      <button class="btn login-btn" @click="openAuth('login')">
        Login
      </button>
      <button class="btn register-btn" @click="openAuth('register')">
        Register
      </button>
    </div>

    <!-- Модал за вход и регистрация -->
    <AuthModal
      :show="showAuthModal"
      :start-tab="modalTab"
      @close="showAuthModal = false"
    />
  </nav>
</template>

<style scoped>
.navbarr {
  background-color: #DEE1DD;
  padding: 14px 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-links {
  list-style: none;
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn {
  background: transparent;
  border: 2px solid #2F575D;
  color: #2F575D;
}
.login-btn:hover {
  background: #2F575D;
  color: white;
}

.register-btn {
  background: #658B6F;
  border: 2px solid #658B6F;
  color: white;
}
.register-btn:hover {
  background: #2F575D;
  border-color: #2F575D;
}
</style>
