<script setup>
import AuthModal from '@/components/AuthModal.vue';
import { logout } from '@/services/authService';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const showAuthModal = ref(false);
const modalTab = ref('login');

function openAuth(tab) {
  modalTab.value = tab;
  showAuthModal.value = true;
}

const { user } = storeToRefs(useUserStore());

async function handleLogout() {
  await logout();
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

    <div v-if="!user" class="auth-buttons">
      <button class="btn login-btn" @click="openAuth('login')">
        Login
      </button>
      <button class="btn register-btn" @click="openAuth('register')">
        Register
      </button>
    </div>

    <div v-else class="auth-buttons">
      <span>Welcome, {{ user.email }} !</span>
      <button class="btn logout-btn" @click="handleLogout">
        Logout
      </button>
    </div>

    <AuthModal v-model:show="showAuthModal" :start-tab="modalTab" />
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
.auth-buttons { display: flex; gap: 12px; align-items: center; }
.btn {
  padding: 8px 16px; border-radius: 6px; font-weight: 600;
  cursor: pointer; transition: all 0.3s ease;
}
.login-btn { background: transparent; border: 2px solid #2F575D; color: #2F575D; }
.login-btn:hover { background: #2F575D; color: #fff; }
.register-btn { background: #658B6F; border: 2px solid #658B6F; color: #fff; }
.register-btn:hover { background: #2F575D; border-color: #2F575D; }
.logout-btn { background: transparent; border: 2px solid #B33A3A; color: #B33A3A; }
.logout-btn:hover { background: #B33A3A; color: #fff; }
</style>
