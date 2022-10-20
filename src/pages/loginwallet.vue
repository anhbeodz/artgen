<template>
  <div>
    <div
      class="container min-h-screen flex justify-center items-center mx-auto"
    >
      <div
        class="md:w-[600px] md:mt-[-60px] mx-auto bg-white dark:bg-[#1c1930] shadow-[0px_4px_8px_rgba(0,0,0,0.08)] lg:p-[60px_80px] p-[30px_20px] rounded-[24px] text-center dark:text-white"
      >
        <img
          src="../assets/images/paint-palette.png"
          class="mx-auto md:w-[128px] w-[90px] mb-[16px]"
          alt="Art Generator"
        />
        <h1 class="dark:text-white mb-[8px]">Let’s get started!</h1>
        <p class="mb-[24px]">Create new accounts with a wallet</p>
        <button
          v-on:click="isShow = true"
          class="btn-gradient hover:hover-button box-gradient btn-larger flex items-center justify-center mx-auto"
        >
          <i class="artgen-wallet mr-[7px]"></i>
          Connect Wallet
        </button>
      </div>
    </div>
    <div
      v-if="isShow"
      class="text-center fixed flex items-center justify-center w-full h-full z-10 top-0 left-0"
    >
      <div
        v-on:click="isShow = false"
        class="walletModal__overlay bg-black opacity-70 absolute h-full w-full cursor-pointer"
      ></div>
      <div class="modal bg-white p-8 md:w-[350px] relative rounded-[20px]">
        <h2 class="text-xl mb-6">Connect to your wallet</h2>
        <button class="wallet-provider px-3">
          <img
            class="w-[40px] m-auto mb-3"
            src="../assets/images/metamask.svg"
            alt="MetaMask"
          />
          <p class="text-heading">Metamask</p>
        </button>
        <button class="wallet-provider px-3">
          <img
            class="w-[40px] m-auto mb-3"
            src="../assets/images/walletconnect.svg"
            alt="WalletConnect"
          />
          <p class="text-heading">Walletconnect</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
    };
  },
};
</script>
