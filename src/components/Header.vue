<template>
  <header class="bg-[rgba(0,0,0,1)] py-[4px]">
    <div
      class="px-[15px] lg:px-[25px] flex flex-wrap justify-end items-center mx-auto"
    >
      <a href="/" class="flex items-center mr-auto">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          class="mr-3 h-6 sm:h-10"
          alt="Art Generator"
        />
        <span
          class="self-center text-xl font-semibold whitespace-nowrap text-white"
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
        class="text-white px-[24px] hover:link-gradient border-l-[1px] border-[#443D81] cursor-pointer text-[20px] toggle-darktheme"
      >
        <label for="toggle-darktheme">
          <input
            id="toggle-darktheme"
            type="checkbox"
            checked
            class="absolute border-0 h-[1px] w-[1px] p-0 m-[-1px] whitespace-nowrap overflow-hidden appearance-none"
          />
          <i
            class="artgen-moon w-[24px] text-white dark:text-white text-[22px] moon cursor-pointer hover:link-gradient"
          ></i>
          <i
            class="artgen-sun w-[24px] text-white dark:text-white text-[23px] sun cursor-pointer hover:link-gradient"
          ></i>
        </label>
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
  </header>
</template>
<script>
export default {
  data() {
    return {
      currentTheme: localStorage.getItem("theme"),
      showMobileMenu: false,
      limitPosition: 200,
      scrolled: false,
      lastPosition: 0,
    };
  },
  mounted() {
    const toggleSwitch = document.querySelector(
      '.toggle-darktheme input[type="checkbox"]'
    );

    if (this.currentTheme === "light") {
      //this.currentTheme.checked = true;
      document.documentElement.classList.add("light", this.currentTheme);
      document.querySelector(".sun").style.display = "none";
      document.querySelector(".moon").style.display = "block";
    } else {
      document.documentElement.classList.add("dark", this.currentTheme);
      document.querySelector(".sun").style.display = "block";
      document.querySelector(".moon").style.display = "none";
    }

    toggleSwitch.addEventListener("change", this.switchTheme, false);
  },
  methods: {
    switchTheme(e) {
      if (e.target.checked) {
        document.querySelector("html").classList.add("dark");
        document.querySelector("html").classList.remove("light");
        document.querySelector(".sun").style.display = "block";
        document.querySelector(".moon").style.display = "none";
        localStorage.setItem("theme", "dark");
      } else {
        document.querySelector("html").classList.add("light");
        document.querySelector("html").classList.remove("dark");
        document.querySelector(".moon").style.display = "block";
        document.querySelector(".sun").style.display = "none";
        localStorage.setItem("theme", "light");
      }
    },
    // Stickey header
    handleScroll() {
      if (
        this.lastPosition < window.scrollY &&
        this.limitPosition < window.scrollY
      ) {
        this.scrolled = true;
        // move up!
      }

      if (this.lastPosition > window.scrollY) {
        this.scrolled = false;
        // move down
      }

      this.lastPosition = window.scrollY;
      // this.scrolled = window.scrollY > 250;
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
