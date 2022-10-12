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
        class="flex relative cursor-pointer justify-center items-center dark:bg-backgroundOverlayDark bg-backgroundOverlay rounded-[8px] p-[30px] before-border"
        for="files"
      >
        <div
          class="bg-[rgb(99,97,128,0.1)] dark:bg-[rgba(0,156,228,0.3)] rounded-[8px] w-[80px] h-[80px] flex justify-center items-center mr-[22px]"
        >
          <i
            class="artgen-thumb text-[38px] md:text-[48px] dark:text-white opacity-[0.5] dark:opacity-[1]"
          ></i>
        </div>
        <div class="flex flex-col">
          <div class="mr-[14px] flex items-center mb-[12px]">
            <p
              class="text-heading dark:text-white md:text-[16px] mr-[13px] font-bold"
            >
              Drag and drop photos or
            </p>
            <button class="btn-gradient hover:hover-button btn-small">
              Open folder
            </button>
          </div>
          <div class="flex text-[#636180] relative z-20">
            <span class="mr-[7px]">Number of artwork:</span>
            <input
              type="text"
              class="!w-[50px] !p-[5px] h-[24px] !rounded-[4px] dark:!bg-[rgba(19,14,49,0.5)] text-right mr-[3px]"
              v-model="selectedBranchMin"
            />/
            <span class="ml-[3px]">{{ maxCurValue }}</span>
          </div>
        </div>
        <input
          class="type-file cursor-pointer"
          id="files"
          type="file"
          ref="files"
          webkitdirectory
          multiple
        />
      </label>

      <draggable
        class="flex"
        tag="ul"
        v-model="objLayers"
        item-key="id"
        @start="drag = true"
        @end="drag = false"
      >
        <template #item="{ element, index }">
          <div>
            <li class="border-[1px] p-2 m-1 bg-cyan-50 cursor-move">
              {{ element.name }}
            </li>
            <li class="border-[1px] p-2 m-1">
              <div>
                <p v-for="ci in layerFiles[element.name]" class="text-[12px]">
                  <input type="checkbox" v-model="objectDB[ci].checked" />
                  {{ objectDB[ci].value }}
                  <input
                    type="text"
                    class="w-11 h-1 text-[9px]"
                    v-model="objectDB[ci].rarity"
                  />
                </p>
              </div>
            </li>
          </div>
        </template>
      </draggable>
    </div>
    <p class="text-larger dark:text-white">Artwork info</p>
    <div
      class="border-[1px] border-border dark:border-borderDark rounded-[8px] dark:text-white p-[20px] mb-[24px]"
      v-if="display"
    >
      <div class="">
        <div class="text-left">
          <label for="countries_multiple" class="block mb-[8px]"
            >Select a branch</label
          >
          <select
            @change="onBranchChange"
            v-model="branchCID"
            multiple
            id="countries_multiple"
            class="h-[100px] mb-[15px]"
          >
            <option v-for="branch in branches" :value="branch.cid">
              {{ branch.label }}
            </option>
          </select>
          <div class="text-right mb-[24px]">
            <button
              @click="createBranch"
              v-if="!isCreateDisabled"
              class="btn-gradient hover:hover-button box-gradient"
            >
              Create branch
            </button>
            <button @click="createBranch" class="" v-else disabled>
              Create branch
            </button>
            <button
              @click="saveBranch"
              v-if="!isSaveDisabled"
              class="ml-[16px] box-gradient bg-transparent link-gradient hover:bg-hover-gradient hover:hover-link-gradient"
            >
              Save
            </button>
            <button
              v-else
              class="ml-[16px] !bg-transparent border-[1px] text-[rgba(99,97,128,0.5)]"
              disabled
            >
              Save
            </button>

            <button
              @click="deleteBranch"
              class="ml-[16px] bg-transparent border-[1px] border-[#FF314F] text-[#FF314F]"
              v-if="!isSaveDisabled"
            >
              Delete
            </button>
            <button
              @click="deleteBranch"
              class="ml-[16px] !bg-transparent border-[1px] text-[rgba(99,97,128,0.5)]"
              v-else
              disabled
            >
              Delete
            </button>
          </div>

          <!-- <input type="checkbox" v-model="allowDup" /> Allow dupplicates -->
          <div class="flex md:flex-row flex-col mb-[24px]">
            <div class="flex-[0_0_100%] md:flex-[0_0_50%] md:mr-[12px]">
              <label class="pb-[8px] inline-block">Collection ID</label>&nbsp;
              <input
                placeholder="Collection ID"
                class="text-text"
                type="text"
                v-model="collectionName"
              />
            </div>

            <div class="flex-[0_0_100%] md:flex-[0_0_50%] md:ml-[12px]">
              <label class="pb-[8px] inline-block">Name prefix</label
              >&nbsp;&nbsp;
              <input
                class="text-text"
                placeholder="Your collection"
                type="text"
                v-model="namePrefix"
              />
            </div>
          </div>
          <div class="mb-[24px]">
            <label class="pb-[8px] inline-block">Description</label>
            <textarea
              id="message"
              rows="2"
              class="text-text"
              placeholder="Remember to replace this description"
              v-model="description"
            ></textarea>
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
        <button
          class="btn-larger btn-gradient hover:hover-button box-gradient text-white"
          @click="generate"
          v-if="!isGenerateDisabled"
        >
          Generate
        </button>
        <button class="btn-larger" @click="generate" v-else disabled>
          Generate
        </button>
      </div>
      <div role="status" v-if="isSpinner">
        <svg
          aria-hidden="true"
          class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
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
      description: "Remember to replace this description",
      namePrefix: "Your collection",
      isSpinner: false,
      display: false,
      isAddedListener: false,
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
    } catch (err) {}

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
              this.collectionName = `${Math.round(Date.now() / 1000)}${
                names[0]
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
      if (this.branches.length > 0 && !this.isSpinner) return false;
      return true;
    },
  },

  watch: {
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
          self.isSpinner = false;
          alert(
            "Task is in pool for generating. You can go to `List` to check current status."
          );
          console.log(res);
        })
        .catch(function (err) {
          alert("ERROR PLEASE RECHECK AND CONTACT SITE'S ADMINISTRATOR.");
          self.isSpinner = false;
          console.log(err);
        });
    },
    getDirectoryInfo() {},
    increment() {
      this.count++;
    },
  },
};
</script>
