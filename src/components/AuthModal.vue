<script setup>
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  startTab: { type: String, default: 'login' },
});
const emit = defineEmits(['update:show']);

const show = computed({
  get: () => props.show,
  set: v => emit('update:show', v),
});

const activeTab = ref(props.startTab);
watch(() => props.startTab, v => (activeTab.value = v));

const close = () => (show.value = false);
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="close()">
    <transition name="fade-scale">
      <div class="modal-content">
        <!-- <div class="tabs">
          <button :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">
            Login
          </button>
          <button :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">
            Register
          </button>
          <button class="x" aria-label="Close" @click="close()">
            ×
          </button>
        </div> -->
        <transition name="slide-fade" mode="out-in">
          <component
            :is="activeTab === 'login' ? Login : Register"
            :key="activeTab"
            @close="close()"
          />
        </transition>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; justify-content:center; align-items:center; z-index:1000; }
.modal-content { background:#DEE1DD; padding:30px; border-radius:14px; box-shadow:0 8px 20px rgba(0,0,0,.12); width:100%; max-width:480px; }
.tabs { display:flex; gap:10px; margin-bottom:20px; position:relative; }
.tabs button { flex:1; padding:10px; border-radius:8px; border:2px solid #99AEAD; background:transparent; color:#28363D; font-weight:600; cursor:pointer; transition:all .3s; }
.tabs button.active { background:#99AEAD; color:#fff; }
.tabs button:hover { background:#658B6F; color:#fff; }
.tabs .x { position:absolute; right:0; top:-8px; width:36px; height:36px; border:none; background:transparent; font-size:24px; line-height:1; color:#28363D; cursor:pointer; }

.fade-scale-enter-active { animation: fadeIn .25s ease forwards; }
.fade-scale-leave-active { animation: fadeOut .2s ease forwards; }
@keyframes fadeIn { from{opacity:0; transform:scale(.96)} to{opacity:1; transform:scale(1)} }
@keyframes fadeOut { from{opacity:1; transform:scale(1)} to{opacity:0; transform:scale(.96)} }

.slide-fade-enter-active, .slide-fade-leave-active { transition: all .25s ease; }
.slide-fade-enter-from { opacity:0; transform: translateY(8px); }
.slide-fade-leave-to   { opacity:0; transform: translateY(-8px); }
</style>
