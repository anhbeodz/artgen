<script setup>
let counter = ref(0);

setInterval(() => {
  counter.value++;
}, 1000);
</script>

<template>
  <div class="bg-backgroundDark">
    <nav class="bg-[rgba(0,0,0,1)] py-[14px]">
      <div
        class="px-[15px] lg:px-[25px] flex flex-wrap justify-end items-center mx-auto"
      >
        <a href="/" class="flex items-center mr-auto">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            class="mr-3 h-6 sm:h-10"
            alt="Flowbite Logo"
          />
          <span
            class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
            >Art Generator</span
          >
        </a>
        <div class="hidden lg:block" id="mobile-menu">
          <ul class="flex lg:flex-row flex-col font-heading items-center">
            <li>
              <a
                href="/"
                class="text-white px-[24px] hover:link-gradient"
                aria-current="page"
                >Create</a
              >
            </li>
            <li>
              <a href="/list" class="text-white px-[24px] hover:link-gradient">
                List</a
              >
            </li>
            <li>
              <a href="/login" class="text-white px-[24px] hover:link-gradient"
                >Login</a
              >
            </li>
          </ul>
        </div>
        <div
          class="text-white px-[24px] hover:link-gradient border-l-[1px] border-[#443D81] cursor-pointer text-[20px]"
        >
          <i class="artgen-sun"></i>
        </div>
        <button
          data-collapse-toggle="mobile-menu"
          type="button"
          class="text-white hover:link-gradient block lg:hidden text-[20px]"
          aria-controls="mobile-menu-2"
          aria-expanded="false"
        >
          <i class="artgen-menu-bars"></i>
        </button>
      </div>
    </nav>

    <main class="py-[15px] dark">
      <router-view />
    </main>
  </div>
</template>
