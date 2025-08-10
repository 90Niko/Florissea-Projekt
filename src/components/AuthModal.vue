<script setup>
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  startTab: {
    type: String,
    default: 'login',
  },
});
const emit = defineEmits(['close']);

const activeTab = ref(props.startTab);

// Ако променим startTab отвън, обновяваме вътре
watch(() => props.startTab, (val) => {
  activeTab.value = val;
});
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emit('close')">
    <transition :name="$screenWidth > 768 ? 'fade-scale' : 'slide-up'">
      <div class="modal-content">
        <div class="tabs">
          <button
            :class="{ active: activeTab === 'login' }"
            @click="activeTab = 'login'"
          >
            Login
          </button>
          <button
            :class="{ active: activeTab === 'register' }"
            @click="activeTab = 'register'"
          >
            Register
          </button>
        </div>

        <transition name="slide-fade" mode="out-in">
          <component :is="activeTab === 'login' ? Login : Register" />
        </transition>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end; /* по подразбиране - мобилно */
  z-index: 1000;
}

.modal-content {
  background: #DEE1DD;
  padding: 30px;
  border-radius: 14px 14px 0 0;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.12);
  width: 100%;
  max-width: 480px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #99AEAD;
  background: transparent;
  color: #28363D;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tabs button.active {
  background: #99AEAD;
  color: white;
}

.tabs button:hover {
  background: #658B6F;
  color: white;
}

/* ---- Анимации ---- */

/* Mobile slide-up */
.slide-up-enter-active {
  animation: slideUp 0.35s ease forwards;
}
.slide-up-leave-active {
  animation: slideDown 0.3s ease forwards;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes slideDown {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}

/* Desktop fade-scale */
.fade-scale-enter-active {
  animation: fadeScaleIn 0.3s ease forwards;
}
.fade-scale-leave-active {
  animation: fadeScaleOut 0.25s ease forwards;
}
@keyframes fadeScaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes fadeScaleOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.9); }
}

/* Slide + fade for form switch */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ---- Desktop Styling ---- */
@media (min-width: 769px) {
  .modal-overlay {
    align-items: center; /* центрираме вертикално */
  }
  .modal-content {
    border-radius: 14px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
}
</style>
