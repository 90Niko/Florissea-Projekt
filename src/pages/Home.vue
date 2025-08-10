<script setup>
// Можеш да добавиш логика тук, ако ти трябва
</script>

<template>
  <div class="home-page">
    <!-- Секция 1: Заглавие и кратко описание -->
    <section class="hero-section">
      <h1>Добре дошли в Сапунени Цветя</h1>
      <p>Красиви и ароматни цветя, направени от сапун — перфектният подарък за всякакъв повод.</p>
    </section>

    <!-- Секция 2: Нашите продукти -->
    <section class="products-section">
      <h2>Нашите продукти</h2>
      <p>Предлагаме разнообразие от цветя, ръчно изработени с грижа и внимание към детайла.</p>
    </section>

    <!-- Секция 3: Контакти -->
    <section class="contact-section">
      <h2>Свържете се с нас</h2>
      <p>Имате въпроси или поръчки? Свържете се с нас на <a href="mailto:info@soapflowers.bg">info@soapflowers.bg</a>.</p>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

section {
  margin-bottom: 40px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

h1 {
  font-size: 2.4rem;
  margin-bottom: 12px;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: #2c3e50;
}

p {
  font-size: 1.1rem;
  line-height: 1.5;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
