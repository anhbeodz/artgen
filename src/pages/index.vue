<route lang="json">
{
  "meta": {
    "title": "ArtWork Generator"
  }
}
</route>

<script setup>
useHead({
  title: "ArtWork Generator",
});
</script>

<template>
  <div class="container m-auto" v-if="display">
    <h1 class="dark:text-white mb-[20px]">Create Artwork</h1>
    <div class="dark:text-white mb-[40px]">
      <p class="text-larger">Upload Image</p>
      <label
        class="flex sm:flex-row flex-col relative cursor-pointer justify-center items-center dark:bg-backgroundOverlayDark bg-backgroundOverlay rounded-[8px] p-[30px] before-border"
        for="files">
        <div
          class="bg-[rgb(99,97,128,0.1)] dark:bg-[rgba(0,156,228,0.3)] rounded-[8px] w-[80px] h-[80px] flex justify-center items-center sm:mr-[22px] mb-[16px] sm:mb-0">
          <i class="artgen-thumb text-[38px] md:text-[48px] dark:text-white opacity-[0.5] dark:opacity-[1]"></i>
        </div>
        <div class="flex flex-col">
          <div class="flex sm:flex-row flex-col items-center sm:mb-[12px] mb-[30px]">
            <p class="text-heading dark:text-white md:text-[16px] sm:mr-[13px] font-bold mb-[16px] sm:mb-0">
              Drag and drop photos or
            </p>
            <button class="btn-gradient hover:hover-button btn-small">
              Open folder
            </button>
          </div>

        </div>
        <input class="type-file cursor-pointer" id="files" type="file" ref="files" webkitdirectory multiple />
      </label>

      <draggable
        class="flex mt-[1px] bg-backgroundOverlay dark:bg-backgroundOverlayDark rounded-[8px] flex-wrap px-[10px]"
        tag="ul" v-model="objLayers" item-key="id" @start="drag = true" @end="drag = false">
        <template #item="{ element, index }">
          <div
            class="xl:flex-[0_0_12.5%] lg:flex-[0_0_16.6666%] md:flex-[0_0_33.3333%] flex-[0_0_50%] mb-[30px] pt-[14px]">
            <li class="cursor-move px-[8px]">
              <div class="bg-[rgb(54,191,255,0.2)] p-[4px_12px] font-bold relative">
                <i class="artgen-drap mr-[9px]"></i>
                {{ element.name }}
                <p class="rejected-message">You can drag and drop to reorder</p>
              </div>
            </li>
            <li class="px-[8px]">
              <div class="mt-[11px]">
                <p v-for="ci in layerFiles[element.name]"
                  class="text-[12px]  mb-[8px] last:mb-[0] border-b-[1px] border-[rgba(255,255,255,0.8)] dark:border-[rgba(0,156,228,0.2)] pb-[8px] last:border-none">
                  <label class="pb-[11px] block leading-[14px]">{{ objectDB[ci].value }}</label>
                <div class="flex justify-end">
                  <input class="mr-auto" type="checkbox" v-model="objectDB[ci].checked" />
                  <input type="text" placeholder="0"
                    class="!w-[35px] !h-[16px] text-[12px] !bg-[rgba(54,48,109,0.1)] dark:!bg-[rgba(19,14,49,0.5)] !rounded-[2px] text-right !p-[5px] text-white"
                    v-model="objectDB[ci].rarity" />
                </div>
                </p>
              </div>
            </li>
          </div>
        </template>
      </draggable>
    </div>
    <div class="flex text-[#636180] relative z-20 top-hover">
      <span class="mr-[7px]">Number of artwork:</span>
      <input type="text" placeholder="0" @keypress="isNumber($event)"
        class="!w-[50px] !p-[5px] h-[24px] !rounded-[4px] !bg-[rgba(54,48,109,0.1)] dark:!bg-[rgba(19,14,49,0.5)] text-right mr-[3px]"
        v-model="selectedBranchMin" />/
      <span class="ml-[3px]">{{ maxCurValue }}</span>
      <p class="rejected-message">Add number of artwork you want to create before edit artwork info</p>
    </div>
    <br>
    <p class="text-larger dark:text-white">Artwork Info</p>
    <div
      class="border-[1px] border-border dark:border-borderDark rounded-[8px] dark:text-white md:p-[20px] p-[20px_15px] mb-[24px]"
      v-if="display">
      <div class="">
        <div class="">
          <label for="countries_multiple" class="block mb-[8px]">Select a branch</label>
          <select @change="onBranchChange" v-model="branchCID" multiple id="countries_multiple"
            class="h-[100px] mb-[15px] !bg-none">
            <option v-for="branch in branches" :value="branch.cid" class="p-[7px_20px]">
              {{ branch.label }}
            </option>
          </select>
          <div class="text-right mb-[24px]">
            <button @click="createBranch" v-if="!isCreateDisabled"
              class="md:mb-0 mb-[10px] btn-gradient hover:hover-button box-gradient">
              Create branch
            </button>
            <button @click="createBranch" class="md:mb-0 mb-[10px]" v-else disabled>
              Create branch
            </button>
            <button @click="saveBranch" v-if="!isSaveDisabled"
              class="md:ml-[16px] md:mb-0 mb-[10px] ml-[8px] box-gradient bg-transparent link-gradient hover:bg-hover-gradient hover:hover-link-gradient">
              Save
            </button>
            <button v-else
              class="md:ml-[16px] md:mb-0 mb-[10px] ml-[8px] !bg-transparent border-[1px] text-[rgba(99,97,128,0.5)]"
              disabled>
              Save
            </button>

            <button @click="deleteBranch"
              class="md:ml-[16px] md:mb-0 mb-[10px] ml-[8px] bg-transparent border-[1px] border-[#FF314F] text-[#FF314F]"
              v-if="!isSaveDisabled">
              Delete
            </button>
            <button @click="deleteBranch"
              class="md:ml-[16px] md:mb-0 mb-[10px] ml-[8px] !bg-transparent border-[1px] text-[rgba(99,97,128,0.5)]"
              v-else disabled>
              Delete
            </button>
          </div>

          <div class="flex md:flex-row flex-col mb-[24px]">
            <div class="flex-[0_0_100%] md:flex-[0_0_50%] md:pr-[12px] md:mb-0 mb-[24px]">
              <label class="pb-[8px] inline-block">Network Chain</label>
              <select id="network" v-model="network">
                <option value="eth">Ethereum</option>
                <option value="sol">Solana</option>
              </select>
            </div>
            <div v-if="network == 'sol'" class="flex-[0_0_100%] md:flex-[0_0_50%] md:pr-[12px] md:mb-0 mb-[24px]">
              <label class="pb-[8px] inline-block">Creator address <span class="text-[#ff0000]">*</span></label>
              <input class="dark:!text-white" placeholder="N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw"
                v-model="sol_address" />
              <p class="text-[14px] text-[#ff0000] mt-[5px]">This is require field. </p>
            </div>
          </div>
          <div v-if="network == 'sol'" class="flex md:flex-row flex-col mb-[24px]">
            <div class="flex-[0_0_100%] md:flex-[0_0_50%] md:pr-[12px] md:mb-0 mb-[24px]">
            </div>
            <div class="flex-[0_0_100%] md:flex-[0_0_50%] md:pr-[12px] md:mb-0 mb-[24px]">
              <label class="pb-[8px] inline-block">Royalties Percentage <span class="text-[#ff0000]">*</span></label>
              <input class="dark:!text-white" @keypress="isNumber($event)" placeholder="5%" v-model="sol_perc" />
              <p class="text-[14px] text-[#ff0000] mt-[5px]">This is require field. </p>
            </div>
            <!-- <div class="flex-[0_0_100%] md:flex-[0_0_50%] md:pr-[12px] md:mb-0 mb-[24px]">
              <label class="pb-[8px] inline-block">Creator share <span class="text-[#ff0000]">*</span></label>
              <input placeholder="10%" value="" />
              <p class="text-[14px] text-[#ff0000] mt-[5px]">This is require field.</p>
            </div> -->
          </div>
          <!-- <input type="checkbox" v-model="allowDup" /> Allow dupplicates -->
          <div class="flex md:flex-row flex-col mb-[24px]">
            <div class="flex-[0_0_100%] md:flex-[0_0_50%] md:pr-[12px] md:mb-0 mb-[24px]">
              <label class="pb-[8px] inline-block">Collection ID</label>&nbsp;
              <input placeholder="Collection ID" class="text-text" type="text" v-model="collectionName" />
            </div>

            <div class="flex-[0_0_100%] md:flex-[0_0_50%] md:pl-[12px]">
              <label class="pb-[8px] inline-block">Name Prefix</label>&nbsp;&nbsp;
              <input class="text-text" :placeholder="'Your collection'" :value="namePrefix" type="text" />
            </div>
          </div>
          <div class="mb-[24px]">
            <label class="pb-[8px] inline-block">Description</label>
            <textarea id="message" rows="2" class="" :placeholder="'Remember to replace this description'"
              :value="description"></textarea>
          </div>
          <div>
            <label class="pb-[8px] inline-block">baseUri</label>
            <input class="" type="text" v-model="baseUri" disabled />
          </div>
          <!-- <p>MAX TASK ART GENERATE: {{ calculate }}</p> -->
        </div>
      </div>
    </div>
    <div class="mb-[15px]">
      <div class="text-center">
        <button class="btn-larger btn-gradient hover:hover-button box-gradient text-white" @click="generate"
          v-if="!isGenerateDisabled">
          Generate
        </button>
        <button class="btn-larger" @click="generate" v-else disabled>
          Generate
        </button>
      </div>
      <div class="fixed flex items-center justify-center w-full h-full z-[100] top-0 left-0" role="status"
        v-if="isSpinner">
        <div @click="closePopup()" class="walletModal__overlay bg-black opacity-[0.7] absolute h-full w-full"></div>
        <div
          class="box-gradient bg-white dark:bg-[#130E31] p-[23px] lg:w-[790px] relative rounded-[8px] shadow-[0px_8px_16px_rgba(0,0,0,0.25)] mx-[15px] text-center">
          <i class="artgen-close_ring cursor-pointer absolute z-[10] right-[20px] top-[20px] text-[20px] hover:link-gradient text-subText"
            @click="closePopup()"></i>
          <div class="text-left dark:text-white text-[20px] font-bold mb-[40px]">Notification</div>
          <div v-if="completedGenerate">
            <i class="artgen-subtract-2 text-[#1CAA32] text-[54px] mx-auto"></i>
            <h3 class="text-[20px] font-bold mb-[8px] text-heading dark:text-white leading-[23px] relative mt-[14px]">
              Generate Artwork Completed!
            </h3>
            <p class="text-heading dark:text-white relative mb-[36px] mt-[17px]">
              Please check List Tab on Menu to check out your artworks!
            </p>
            <div class="text-center flex justify-center relative">
              <button
                class="btn-larger box-gradient bg-transparent link-gradient hover:bg-hover-gradient hover:hover-link-gradient mr-[12px]"
                @click="closePopup()">Cancel</button>
              <button class="btn-larger btn-gradient hover:hover-button box-gradient text-white ml-[12px]"
                @click="goToList()">View Artwork</button>
            </div>
          </div>
          <div v-else-if="errorGenerate">
            <i class="artgen-subtract  text-[#FF314F] text-[54px] mx-auto"></i>
            <h3 class="text-[20px] font-bold mb-[8px] text-heading dark:text-white leading-[23px] relative mt-[14px]">
              Generate Artwork Failed!
            </h3>
            <p class="text-heading dark:text-white relative mb-[36px] mt-[17px]">
              Something happened. Please try again.
            </p>
            <div class="text-center flex justify-center relative">
              <button
                class="btn-larger box-gradient bg-transparent link-gradient hover:bg-hover-gradient hover:hover-link-gradient mr-[12px]"
                @click="closePopup()">Cancel</button>
              <button class="btn-larger btn-gradient hover:hover-button box-gradient text-white ml-[12px]"
                @click="closePopup()">Go Back</button>
            </div>
          </div>
          <div v-else>
            <svg aria-hidden="true" class="mx-auto w-8 h-8 text-heading animate-spin dark:text-white fill-primary"
              viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill" />
            </svg>
            <h3 class="text-[20px] font-bold mb-[8px] text-heading dark:text-white leading-[23px] relative mt-[14px]">
              Generating Artwork ...
            </h3>
            <p class="text-heading dark:text-white relative mb-[20px]">
              Please wait a few minute
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  // state
  data() {
    return {
      count: 0,
      objectDB: {},
      layers: [],
      objLayers: [],
      layerFiles: {},
      branches: [],
      files: [],
      branchCID: "",
      maxCurValue: 0,
      selectedBranchMin: 0,
      allowDup: false,
      drag: false,
      collectionName: "",
      baseUri: `https://art.getrik.com/c${this.stringHashCode(
        localStorage.getItem("username")
      )}`,
      isSpinner: false,
      description: "",
      namePrefix: "",
      display: false,
      isAddedListener: false,
      show: false,
      completedGenerate: false,
      errorGenerate: false,
      network: "eth",
      sol_perc: "",
      sol_address: "",
    };
  },

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
    } catch (err) { }

    if (!checked) return this.$router.push("login");
    this.accessToken = accessToken;
    this.display = true;
  },

  async updated() {
    let picker = document.getElementById("files");
    if (picker && !this.isAddedListener) {
      this.isAddedListener = true;
      picker?.addEventListener("change", (e) => {
        this.objectDB = {};
        this.layers = [];
        this.objLayers = [];
        this.layerFiles = {};
        this.files = [];
        let cid = 0;
        for (let file of Array.from(e.target.files)) {
          if (file.type == "image/png") {
            let names = file.webkitRelativePath.split("/");
            console.log("NAMES:", names.length);
            if (names.length != 3) {
              alert(
                "Folder structure not correct! Layers are folders and containing PNG's files. Choose Folder to upload containing Layers."
              );
              return false;
            }
            if (!this.collectionName)
              this.collectionName = `${Math.round(Date.now() / 1000)}${names[0]
                }`;
            if (names.length > 1) {
              let raring = names[names.length - 1].split("#");

              let obj = {
                id: this.layerFiles[names[1]]?.length
                  ? this.layerFiles[names[1]].length + 1
                  : 1,
                orginal: file.webkitRelativePath,
                layer: names[1],
                value: raring[0],
                rarity: raring.length > 1 ? raring[1].replace(".png", "") : "",
                checked: true,
              };
              console.log("OBJ:", obj);

              this.objectDB[file.webkitRelativePath] = obj;

              if (this.layers.indexOf(names[1]) == -1) {
                cid++;
                this.objLayers.unshift({
                  name: names[1],
                  id: cid,
                });
                this.layers.unshift(names[1]);
                this.layerFiles[names[1]] = [file.webkitRelativePath];
              } else {
                this.layerFiles[names[1]].push(file.webkitRelativePath);
              }
            }
          }
        }

        //this.fileDatabase = JSON.stringify(database);
      });
    }
  },

  async mounted() {
    let picker = document.getElementById("files");
    picker?.addEventListener("change", (e) => {
      this.objectDB = {};
      this.layers = [];
      this.objLayers = [];
      this.layerFiles = {};
      this.files = [];
      let cid = 0;
      for (let file of Array.from(e.target.files)) {
        if (file.type == "image/png") {
          let names = file.webkitRelativePath.split("/");

          if (!this.collectionName) this.collectionName = names[0];
          if (names.length > 1) {
            let raring = names[names.length - 1].split("#");

            let obj = {
              id: this.layerFiles[names[1]]?.length
                ? this.layerFiles[names[1]].length + 1
                : 1,
              orginal: file.webkitRelativePath,
              layer: names[1],
              value: raring[0],
              rarity: raring.length > 1 ? raring[1].replace(".png", "") : "",
              checked: true,
            };
            console.log("OBJ:", obj);

            this.objectDB[file.webkitRelativePath] = obj;

            if (this.layers.indexOf(names[1]) == -1) {
              cid++;
              this.objLayers.unshift({
                name: names[1],
                id: cid,
              });
              this.layers.unshift(names[1]);
              this.layerFiles[names[1]] = [file.webkitRelativePath];
            } else {
              this.layerFiles[names[1]].push(file.webkitRelativePath);
            }
          }
        }
      }

      //this.fileDatabase = JSON.stringify(database);
    });
  },

  computed: {
    isSaveDisabled() {
      if (this.branchCID) {
        let index = this.branches.findIndex(
          (b) => b.cid * 1 == this.branchCID * 1
        );
        if (index > -1 && this.selectedBranchMin > 0) return false;
      }
      return true;
    },
    isCreateDisabled() {
      if (this.selectedBranchMin > 0) return false;
      return true;
    },
    isGenerateDisabled() {
      if (this.network == "sol" && (!this.sol_address || !this.sol_perc)) return true
      if (this.branches.length > 0 && !this.isSpinner) return false;
      return true;
    },
  },

  watch: {
    sol_perc: function (val) {
      // console.log("watch:", val);
      // val = val.replace("%", "")
      // let v = val.replace("%", "")
      if (val > 99)
        this.sol_perc = 99;
    },
    maxCurValue: function (val) {
      if (val < this.selectedBranchMin) this.selectedBranchMin = val;
    },
    selectedBranchMin: function (val) {
      if (val > this.maxCurValue) this.selectedBranchMin = this.maxCurValue;
    },

    collectionName: function (val) {
      let username = localStorage.getItem("username");
      if (val)
        this.baseUri = `https://art.getrik.com/c${this.stringHashCode(
          username
        )}/${val}`;
    },

    objectDB: {
      handler(val) {
        let layersCount = {};
        let cc = 0;
        Object.keys(this.objectDB).map((k) => {
          if (this.objectDB[k].checked) {
            if (layersCount[this.objectDB[k].layer])
              layersCount[this.objectDB[k].layer] =
                layersCount[this.objectDB[k].layer] + 1;
            else layersCount[this.objectDB[k].layer] = 1;
            cc = 1;
          } else if (!layersCount[this.objectDB[k].layer]) {
            layersCount[this.objectDB[k].layer] = 0;
          }
        });

        Object.keys(layersCount).map((k) => {
          cc = cc * layersCount[k];
        });

        this.maxCurValue = cc;
        console.log(val);
      },
      deep: true,
    },
  },
  // actions
  methods: {
    isNumber: function (evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
      } else {
        return true;
      }
    },
    stringHashCode(str = "") {
      let hash = 0;
      for (let i = 0, len = str?.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    },
    onBranchChange() {
      if (this.branchCID) {
        let branch = this.branches.filter(
          (b) => b.cid * 1 == this.branchCID * 1
        );
        console.log("brach:", branch);
        if (branch.length) {
          //
          console.log("BRANCH _DATA:", branch[0]);
          this.selectedBranchMin = branch[0].num;
          let _branchOb = branch[0].data;
          Object.keys(this.objectDB).map((k) => {
            let o = this.objectDB[k];
            if (_branchOb[o.orginal]?.checked) {
              o.checked = true;
            } else o.checked = false;
            return o;
          });
        }
      }
    },

    deleteBranch() {
      if (this.branchCID) {
        let index = this.branches.findIndex(
          (b) => b.cid * 1 == this.branchCID * 1
        );
        console.log(index, this.branches);
        // alert(this.index);
        if (index > -1) this.branches.splice(index, 1);
      }
    },

    saveBranch() {
      if (this.branchCID) {
        let index = this.branches.findIndex(
          (b) => b.cid * 1 == this.branchCID * 1
        );
        console.log(index, this.branches);
        // alert(this.index);
        if (index > -1) {
          let branchData = {};

          Object.keys(this.objectDB).map((k) => {
            if (this.objectDB[k].checked)
              branchData[k] = {
                id: this.objectDB[k].id,
                orginal: this.objectDB[k].orginal,
                layer: this.objectDB[k].layer,
                value: this.objectDB[k].value,
                rarity: this.objectDB[k].rarity,
                checked: this.objectDB[k].checked,
              };
          });

          this.branches[index].data = branchData;
          this.branches[index].num = this.selectedBranchMin;
        }
      }
    },

    createBranch() {
      this.increment();

      let branchData = {};

      Object.keys(this.objectDB).map((k) => {
        if (this.objectDB[k].checked)
          branchData[k] = {
            id: this.objectDB[k].id,
            orginal: this.objectDB[k].orginal,
            layer: this.objectDB[k].layer,
            value: this.objectDB[k].value,
            rarity: this.objectDB[k].rarity,
            checked: this.objectDB[k].checked,
          };
      });
      this.branches.push({
        label: `Branch data # ${this.count}`,
        cid: this.count,
        data: branchData,
        num: this.selectedBranchMin,
      });
      console.log("create branch", this.count);
    },
    generate() {
      let uploadedFiles = this.$refs.files.files;
      /*
        Adds the uploaded file to the files array
      */
      // for (var i = 0; i < uploadedFiles.length; i++) {
      //   this.files.push(uploadedFiles[i]);
      // }
      // alert(this.sol_perc)
      this.uploadFiles();
    },

    uploadFiles() {
      this.isSpinner = true;
      let formData = new FormData();
      formData.append(
        "meta",
        JSON.stringify({
          layerOrder: this.objLayers.map((l) => l.name),
          branches: this.branches,
          collectionName: this.collectionName,
          baseUri: this.baseUri,
          description: this.description,
          namePrefix: this.namePrefix,
          sol_address: this.sol_address,
          sol_perc: this.sol_perc
        })
      );
      // formData.collection("branch", JSON.stringify(this.branches))
      for (var i = 0; i < this.$refs.files.files.length; i++) {
        let file = this.$refs.files.files[i];
        if (file.type == "image/png") {
          console.log("FILE I", i, " ", file, file.webkitRelativePath);
          formData.append("files[" + i + "]", file);
        }
      }

      let self = this;

      axios
        .post("https://api-art-gen.dev-latteprint.com/createTask", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: `Bearer ${localStorage.getItem("my-access-token")}`,
          },
        })
        .then(function (res) {
          // self.isSpinner = false;
          self.completedGenerate = true;
        })
        .catch(function (err) {
          self.errorGenerate = false;
        });
    },

    getDirectoryInfo() { },
    increment() {
      this.count++;
    },
    closePopup() {
      this.isSpinner = false;
    },
    goToList() {
      this.$router.push(`/list`);
    },
    goToHome() {
      this.$router.push(`/`);
    },
  },
};
</script>
