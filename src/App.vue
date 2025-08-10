<script>
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<template>
  <div class="layout-container">
    <AppHeader />

    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 10px;
}
</style>
