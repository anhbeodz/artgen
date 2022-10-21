<route lang="json">
{
  "meta": {
    "title": "Artwork List"
  }
}
</route>

<script setup>
useHead({
  title: "Artwork List",
});
</script>

<template>
  <div class="min-h-screen pb-[30px]" v-if="display">
    <div class="container mx-auto">
      <h1 class="dark:text-white mb-[20px]">Artwork List</h1>
      <p class="text-larger dark:text-white">Collections</p>
      <div
        class="border-[1px] border-border dark:border-borderDark rounded-[8px] dark:text-white p-[20px] mb-[40px]"
      >
        <div class="flex md:flex-row flex-col md:mx-[-15px]">
          <div class="md:w-1/3 w-full md:px-[15px] mb-[30px] md:mb-0">
            <label
              for="countries_multiple"
              class="block mb-[8px] font-bold dark:text-white"
              >Select a Collection</label
            >
            <select
              @change="onCollectionChange"
              v-model="collectionId"
              multiple
              id="collection_id"
              class="h-[160px] rounded-[8px]"
            >
              <option
                class="p-[7px_20px]"
                v-for="collection in collections"
                :value="collection.id"
                :disabled="collection.status != 'done'"
              >
                <span>{{ collection.id }}</span>
              </option>
            </select>
          </div>
          <div class="md:w-1/3 w-full md:px-[15px] mb-[30px] md:mb-0">
            <label
              for="countries_multiple"
              class="block mb-[8px] font-bold dark:text-white"
              >Select a Branch</label
            >
            <select
              @change="onBranchChange"
              v-model="branchCID"
              multiple
              id="collection_id"
              class="h-[160px] rounded-[8px]"
            >
              <option
                v-for="branch in branches"
                :value="branch.cid"
                class="p-[7px_20px]"
              >
                {{ branch.label }}
              </option>
            </select>
          </div>
          <div class="md:w-1/3 w-full md:px-[15px]">
            <label
              for="countries_multiple"
              class="block mb-[8px] font-bold dark:text-white"
              >Select a Edition</label
            >
            <select
              @change="onEditionChange"
              v-model="edtionCID"
              multiple
              id="edition_id"
              class="h-[160px] rounded-[8px]"
            >
              <option
                v-for="edition in editions"
                :value="edition"
                class="p-[7px_20px]"
              >
                {{ edition }}
              </option>
            </select>
          </div>
        </div>
        <div class="w-full mt-[24px]" v-if="baseUrl != ''">
          <label class="block mb-[8px]">Link</label>
          <div
            class="bg-backgroundOverlay dark:bg-backgroundOverlayDark p-[10px_24px] rounded-[4px] text-subText flex"
          >
            <div
              class="mr-auto whitespace-nowrap overflow-hidden text-ellipsis"
            >
              <span>baseUri=</span>
              <a
                class="hover:text-primary align-middle"
                v-bind:href="baseUrl"
                >{{ baseUrl }}</a
              >
              <input type="hidden" id="baseUri" :value="baseUrl" />
            </div>
            <div v-on:click="copyBaseUri" class="cursor-pointer relative">
              <i class="artgen-duplicate text-[20px] hover:link-gradient"></i>
              <p
                id="copied"
                class="text-[12px] absolute top-[-100%] left-[-10px] dark:text-white"
              >
                {{ msg }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p class="text-larger dark:text-white" v-if="srcEdtion">Artwork</p>
      <div
        class="border-[1px] border-border dark:border-borderDark rounded-[8px] dark:text-white p-[20px] mb-[40px]"
        v-if="srcEdtion"
      >
        <div class="flex md:flex-row flex-col">
          <div
            class="md:w-[380px] lg:w-[480px] w-full md:mr-[24px] mb-[30px] md:mb-0"
          >
            <img class="w-full" :src="srcEdtion" />
          </div>
          <div class="">
            <ul>
              <li v-for="p in edtionPropeties" class="mb-[5px] last:mb-0">
                <b class="mr-[15px]">{{ p.trait_type }}:</b> {{ p.value }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="hrefDownload" class="text-center">
        <label
          class="btn btn-larger btn-gradient hover:hover-button box-gradient text-white cursor-pointer inline-block"
          ><a class="relative z-10" :href="hrefDownload"
            >Download Artwork</a
          ></label
        >
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  async created() {
    let checked = null;
    let accessToken = "";

    try {
      accessToken = localStorage.getItem("my-access-token");
      if (accessToken)
        checked = await axios.post(
          "https://api-art-gen.dev-latteprint.com/check",
          {
            user: "test",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authentication: `Bearer ${accessToken}`,
            },
          }
        );
    } catch (err) {}

    if (!checked) return this.$router.push("login");
    this.display = true;
  },
  mounted() {
    this.checkInterval();
  },

  // watch: {
  //     edtionCID: function (val) {
  //         if (val) {
  //             this.srcEdtion = `https://api-art-gen.dev-latteprint.com/${this.collectionId}/${val}.png`;
  //             console.log("SRC EDTION:", this.srcEdtion)
  //         }

  //         console.log(val)
  //         // this.srcEdtion = "https://api-art-gen.dev-latteprint.com/layers/1.png'
  //     }
  // },
  // state
  data() {
    return {
      serverData: [],
      collections: [],
      branches: [],
      editions: [],
      edtionPropeties: [],
      srcEdtion: "",
      branchCID: "",
      collectionId: "",
      baseUrl: "",
      hrefDownload: "",
      display: false,
      msg: "",
    };
  },
  methods: {
    stringHashCode(str) {
      let hash = 0;
      for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    },
    checkInterval() {
      let self = this;
      let username = localStorage.getItem("username");
      let accessToken = localStorage.getItem("my-access-token");
      axios
        .get(`https://api-art-gen.dev-latteprint.com/collections`, {
          headers: {
            "Content-Type": "application/json",
            Authentication: `Bearer ${accessToken}`,
          },
        })
        .then(function (res) {
          if (res.data) {
            self.serverData = res.data;
            // console.log("test", self.serverData)
            self.collections = self.serverData
              .sort((a, b) => (b.collectionName > a.collectionName ? 1 : -1))
              .map((d) => {
                return {
                  id: d.collectionName,
                  status: d.status,
                  config: d.config,
                };
              });
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      setTimeout(this.checkInterval, 5000);
    },
    onEditionChange: async function () {
      if (this.collectionId && this.edtionCID) {
        let d = null;
        let username = localStorage.getItem("username");

        try {
          d = await axios.get(
            `https://api-art-gen.dev-latteprint.com/${username}/${this.collectionId}/${this.edtionCID}.json`
          );
        } catch (err) {
          console.log(err);
        }
        if (d) {
          this.edtionPropeties = d.data.attributes;
          this.srcEdtion = `https://api-art-gen.dev-latteprint.com/${username}/${this.collectionId}/${this.edtionCID}.png`;
        }
        // console.log("SRC EDTION:", this.srcEdtion)
      }
    },
    onCollectionChange: function () {
      let collection = this.collections.filter(
        (c) => c.id == this.collectionId
      );
      if (collection.length) {
        this.branches = collection[0].config.branches;
        this.editions = [];
        let username = localStorage.getItem("username");

        this.baseUrl = `https://art.getrik.com/c${this.stringHashCode(
          username
        )}/${this.collectionId}/`;
        this.hrefDownload = `https://api-art-gen.dev-latteprint.com/${username}/${this.collectionId}.zip`;
        this.onBranchChange();
      } else {
        this.baseUrl = "";
        this.editions = [];
        this.branches = [];
      }
    },
    onBranchChange: function () {
      let collection = this.collections.filter(
        (c) => c.id == this.collectionId
      );
      if (collection.length) {
        console.log(
          "ERRROR",
          collection[0].config,
          collection[0].config.branches
        );

        let branch = collection[0].config.branches.filter(
          (b) => b.cid == this.branchCID
        );
        if (branch.length) {
          let sD = this.serverData.filter(
            (sd) => sd.collectionName == this.collectionId
          );
          if (sD.length) {
            let branchData = sD[0].branchData[this.branchCID];
            console.log("ERROR-BBB:", branchData);
            baseUri;
            this.editions = branchData.sort((a, b) => a - b);
            this.onEditionChange();
          }
          // this.editions = collection[0].config
        }
      }
    },
    copyBaseUri() {
      let baseUri = document.querySelector("#baseUri");
      baseUri.setAttribute("type", "text");
      baseUri.select();
      try {
        let successful = document.execCommand("copy");
        this.msg = successful ? "Copied!" : "Unsuccessful";
        let copied = document.getElementById("copied");
        setTimeout(function () {
          this.copied.style.display = "none";
        }, 3000);
      } catch (err) {
        alert("Oops, unable to copy");
      }

      /* unselect the range */
      baseUri.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
  },
};
</script>
