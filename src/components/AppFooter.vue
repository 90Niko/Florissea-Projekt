<template>
  <footer class="footer">
    <p>
      &copy; {{ new Date().getFullYear() }} Florrissea · All rights reserved..
    </p>
    <p class="subtext">
      Направено с 🧼 и ❤️
    </p>
  </footer>
</template>

<style>
.footer {
  background-color: #DEE1DD;      /* светло сиво-зелено от палитрата */
  text-align: center;
  font-size: 14px;
  padding: 24px 0;
  margin-top: 48px;
  border-top: 1px solid #99AEAD; /* меко синьо-зелено */
  color: #28363D;                /* много тъмно синьо-зелено */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.footer p {
  margin: 0;
}

.footer .subtext {
  margin-top: 8px;
  color: #2F575D;                /* дълбок синьо-зелен тон */
  font-style: italic;
}
</style>
