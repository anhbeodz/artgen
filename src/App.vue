<script setup>
let counter = ref(0);

setInterval(() => {
  counter.value++;
}, 1000);
</script>

<template>
  <div
    class="min-h-screen bg-white bg-main dark:bg-mainDark dark:bg-backgroundDark bg-repeat-y bg-cover"
  >
    <Header />
    <main class="py-[15px]">
      <router-view />
    </main>
  </div>
</template>
