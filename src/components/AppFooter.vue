<template>
  <footer class="footer">
    <p>
      &copy; {{ new Date().getFullYear() }} Сапунени Цветя · Всички права запазени.
    </p>
    <p class="subtext">
      Направено с 🧼 и ❤️
    </p>
  </footer>
</template>

<style>
.footer {
  background-color: #f5f5f5;      /* светло сив фон */
  text-align: center;
  font-size: 14px;
  padding: 24px 0;                /* вертикален padding */
  margin-top: 48px;
  border-top: 1px solid #d1d1d1; /* светла горна граница */
  color: #555555;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.footer p {
  margin: 0;
}

.footer .subtext {
  margin-top: 8px;
  color: #888888;
  font-style: italic;
}
</style>
