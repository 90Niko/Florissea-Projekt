<script setup>
const links = [
  { name: '/', label: 'Home' },
//   { name: 'about', label: 'About' },
//   { name: 'contacts', label: 'Contacts' },
//   { name: 'favorite', label: 'Favorite' },
//   { name: 'products', label: 'Products' },
];
</script>

<template>
  <nav class="navbarr">
    <ul class="main-links">
      <li v-for="link in links" :key="link.name" class="navbar-item">
        <router-link :to="link.name">
          {{ link.label }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>
