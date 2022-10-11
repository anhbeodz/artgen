<route lang="json">
{
    "meta": {
        "title": "List"
    }
}
</route>
    
<script setup>

useHead({
    title: "List",
});
</script>

<template>
    <div class="bg-blue" v-if="display">
        <div class="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:flex flex lg:justify-start lg:py-16 lg:px-8">
            <div class="text-left w-1/3 mr-8">
                <label for="countries_multiple"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select a
                    Collection</label>
                <select @change="onCollectionChange" v-model="collectionId" multiple id="collection_id"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option v-for="collection in collections" :value="collection.id"
                        :disabled="collection.status != 'done'"><span>{{ collection.id }}</span></option>
                </select>
            </div>
            <div class="text-left w-1/3 mr-8">
                <label for="countries_multiple"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select a
                    Branch</label>
                <select @change="onBranchChange" v-model="branchCID" multiple id="collection_id"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option v-for="branch in branches" :value="branch.cid">{{ branch.label }}</option>
                </select>
            </div>
            <div class="text-left w-1/3">
                <label for="countries_multiple"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select a
                    Edition</label>
                <select @change="onEditionChange" v-model="edtionCID" multiple id="edition_id"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option v-for="edition in editions" :value="edition">{{ edition }}</option>
                </select>
            </div>
        </div>
        <div class="mx-auto max-w-screen-2xl px-4  sm:px-6 lg:flex-row lg:justify-start lg:px-8">
            <div>
                <span v-if="baseUrl!=''">baseUri=</span> <a v-bind:href="baseUrl">{{ baseUrl }}</a>
            </div>
            <br />
            <div v-if="hrefDownload">
                <label class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-1 btn"><a
                        :href="hrefDownload">Download
                        Zip</a></label>
            </div>
        </div>
        <div class="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:flex flex lg:justify-start lg:py-16 lg:px-8">
            <div class="text-left w-1/3 mr-8">
                <img :src="srcEdtion" />
            </div>
            <div class="text-left w-1/3 mr-8">
                <ul>
                    <li v-for="p in edtionPropeties">
                        <b>{{ p.trait_type }}</b> : {{ p.value }}
                    </li>
                </ul>
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
                checked = await axios.post("https://api-art-gen.dev-latteprint.com/check", {
                    user: "test"
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication": `Bearer ${accessToken}`
                    }
                });
        }
        catch (err) {

        }

        if (!checked)
            return this.$router.push('login')
        this.display = true
    },
    mounted() {
        this.checkInterval()
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
            collections: [
            ],
            branches: [],
            editions: [],
            edtionPropeties: [],
            srcEdtion: "",
            branchCID: "",
            collectionId: "",
            baseUrl: "",
            hrefDownload: "",
            display: false,
        }
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
            axios.get(`https://api-art-gen.dev-latteprint.com/collections`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authentication": `Bearer ${accessToken}`
                }
            }).then(function (res) {
                if (res.data) {
                    self.serverData = res.data
                    // console.log("test", self.serverData)
                    self.collections = self.serverData.sort((a, b) => b.collectionName > a.collectionName ? 1 : -1).map(d => {
                        return {
                            id: d.collectionName,
                            status: d.status,
                            config: d.config,
                        }
                    })
                }
            })
                .catch(function (err) {
                    console.log(err)
                });
            setTimeout(this.checkInterval, 5000);
        },
        onEditionChange: async function () {
            if (this.collectionId && this.edtionCID) {
                let d = null;
                let username = localStorage.getItem("username");

                try {
                    d = await axios.get(`https://api-art-gen.dev-latteprint.com/${username}/${this.collectionId}/${this.edtionCID}.json`);
                }
                catch (err) {
                    console.log(err)
                }
                if (d) {
                    this.edtionPropeties = d.data.attributes;
                    this.srcEdtion = `https://api-art-gen.dev-latteprint.com/${username}/${this.collectionId}/${this.edtionCID}.png`;
                }
                // console.log("SRC EDTION:", this.srcEdtion)
            }
        },
        onCollectionChange: function () {
            let collection = this.collections.filter(c => c.id == this.collectionId)
            if (collection.length) {
                this.branches = collection[0].config.branches;
                this.editions = [];
                let username = localStorage.getItem("username");

                this.baseUrl = `https://art.getrik.com/c${this.stringHashCode(username)}/${this.collectionId}/`;
                this.hrefDownload = `https://api-art-gen.dev-latteprint.com/${username}/${this.collectionId}.zip`;
                this.onBranchChange();
            }
            else {
                this.baseUrl = ""
                this.editions = [];
                this.branches = [];
            }
        },
        onBranchChange: function () {
            let collection = this.collections.filter(c => c.id == this.collectionId);
            if (collection.length) {
                console.log("ERRROR", collection[0].config, collection[0].config.branches)

                let branch = collection[0].config.branches.filter(b => b.cid == this.branchCID)
                if (branch.length) {
                    let sD = this.serverData.filter(sd => sd.collectionName == this.collectionId);
                    if (sD.length) {
                        let branchData = sD[0].branchData[this.branchCID];
                        console.log("ERROR-BBB:", branchData)

                        this.editions = branchData.sort((a, b) => a - b);
                        this.onEditionChange()
                    }
                    // this.editions = collection[0].config
                }
            }

        }
    }
}

</script>