<template>
  <header class="bg-[rgba(0,0,0,1)] py-[10px]">
    <div
      class="px-[15px] lg:px-[25px] flex flex-wrap justify-end items-center mx-auto relative"
    >
      <a href="/" class="flex items-center mr-auto">
        <img
          src="../assets/images/paint-palette.png"
          class="mr-3 h-8 sm:h-10"
          alt="Art Generator"
        />
        <span
          class="self-center text-xl font-semibold whitespace-nowrap text-white"
          >Art Generator</span
        >
      </a>
      <div :class="{ active: showMobileMenu }" class="mobile-menu">
        <ul class="flex lg:flex-row flex-col font-heading lg:items-center">
          <li>
            <router-link
              tag="a"
              class="text-white lg:p-[0_24px] p-[15px] hover:link-gradient block border-b-[1px] border-[rgba(255,255,255,0.1)] lg:border-none"
              to="/"
              >Create</router-link
            >
          </li>
          <li>
            <router-link
              tag="a"
              class="text-white lg:p-[0_24px] p-[15px] hover:link-gradient block border-b-[1px] border-[rgba(255,255,255,0.1)] lg:border-none"
              to="/list"
              >List</router-link
            >
          </li>
          <li>
            <router-link
              tag="a"
              class="text-white lg:p-[0_24px] p-[15px] hover:link-gradient block"
              to="/login"
              >Login</router-link
            >
          </li>
        </ul>
      </div>
      <div
        class="text-white pl-[24px] hover:link-gradient border-l-[1px] border-[#443D81] cursor-pointer text-[20px] toggle-darktheme"
      >
        <label for="toggle-darktheme">
          <input
            id="toggle-darktheme"
            type="checkbox"
            checked
            class="absolute border-0 h-[1px] w-[1px] p-0 m-[-1px] whitespace-nowrap overflow-hidden appearance-none"
          />
          <i
            class="artgen-moon w-[24px] text-white text-[22px] moon cursor-pointer hover:link-gradient"
          ></i>
          <i
            class="artgen-sun w-[24px] text-white text-[23px] sun cursor-pointer hover:link-gradient"
          ></i>
        </label>
      </div>
      <button
        @click="showMobileMenu = !showMobileMenu"
        type="button"
        class="text-white hover:link-gradient lg:hidden text-[20px] p-[0_0_0_20px] flex"
      >
        <i
          v-if="!showMobileMenu"
          class="artgen-menu-bars text-white text-[22px] w-[22px] h-[22px]"
        ></i>
        <i
          v-if="showMobileMenu"
          class="artgen-menu-close text-white text-[18px] w-[22px] h-[22px]"
        ></i>
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
