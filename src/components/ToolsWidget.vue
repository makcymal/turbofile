<template>
	<div class="container-fluid">
		<div class="row">

			<div class="col-1 btn-wrapper">
				<mega-button
				v-on:click="$store.commit('stepOutside', 1)" 
				v-bind:active="true && $store.state.activeTabPath != ''"
				>
                    <img src="@/icons/back.svg" class="icon">
			  		<p class="btn-title">Back</p>
                </mega-button>
			</div>

			<div class="col"></div>

			<div class="col-1 btn-wrapper">
				<mega-button
				v-on:clicked="openDirDialog"
				v-bind:active="true && $store.state.activeTabPath != ''"
				>
                    <img src="@/icons/newdir.svg" class="icon">
			  		<p class="btn-title">Dir</p>
                </mega-button>

                <dialog-widget
            	v-bind:actionType="'newdir'"
            	v-bind:visible="dialogDirVisible"
            	v-bind:dirs="dirs"
            	v-bind:files="files"
            	v-on:closeDialog="closeDialog"
            	>
            	</dialog-widget>
			</div>

			<div class="col-1 btn-wrapper">
			  	<mega-button
			  	v-on:clicked="openFileDialog"
			  	v-bind:active="true && $store.state.activeTabPath != ''"
			  	>
                    <img src="@/icons/newfile.svg" class="icon">
			  		<p class="btn-title">File</p>
                </mega-button>

                <dialog-widget
            	v-bind:actionType="'newfile'"
            	v-bind:visible="dialogFileVisible"
            	v-bind:dirs="dirs"
            	v-bind:files="files"
            	v-on:closeDialog="closeDialog"
            	>
            	</dialog-widget>
			</div>

			<div class="col-1 btn-wrapper">
			  	<mega-button
			  	v-on:clicked="$store.commit('updateCopied', 'cut')"
			  	v-bind:active= "$store.getters.countChoicedItems != 0 && $store.state.activeTabPath != '' "
			  	>
                    <img src="@/icons/cut.svg" class="icon">
			  		<p class="btn-title">Cut</p>
                </mega-button>
			</div>

			<div class="col-1 btn-wrapper">
			  	<mega-button
			  	v-on:clicked="$store.commit('updateCopied', 'copy')"
			  	v-bind:active=" $store.getters.countChoicedItems != 0 && $store.state.activeTabPath != '' "
			  	>
                    <img src="@/icons/copy.svg" class="icon">
			  		<p class="btn-title">Copy</p>
                </mega-button>
			</div>

			<div class="col-1 btn-wrapper">
			  	<mega-button
			  	v-on:clicked="paste"
			  	v-bind:active=" $store.getters.ableToCopyHere && $store.getters.countCopiedItems != 0 && $store.state.activeTabPath != '' "
			  	>
                    <img src="@/icons/paste.svg" class="icon">
			  		<p class="btn-title">Paste</p>
                </mega-button>
			</div>

			<div class="col-1 btn-wrapper">
			  	<mega-button
			  	v-on:clicked="openRenameDialog"
			  	v-bind:active=" $store.getters.countChoicedItems == 1 && $store.state.activeTabPath != '' "
			  	>
                    <img src="@/icons/rename.svg" class="icon">
			  		<p class="btn-title">Rename</p>
                </mega-button>

                <dialog-widget
            	v-bind:actionType="'rename'"
            	v-bind:visible="dialogRenameVisible"
            	v-bind:dirs="dirs"
            	v-bind:files="files"
            	v-on:closeDialog="closeDialog"
            	>
            	</dialog-widget>
			</div>

			<div class="col-1 btn-wrapper">
			  	<mega-button
			  	v-on:clicked="openDeleteConf"
			  	v-bind:active=" $store.getters.countChoicedItems != 0 && $store.state.activeTabPath != '' "
			  	>
                    <img src="@/icons/delete.svg" class="icon">
			  		<p class="btn-title">Delete</p>
                </mega-button>

                <mega-confirmation
            	v-bind:visible="confDeleteVisible"
            	v-on:closeDialog="closeDialog"
            	>
            	</mega-confirmation>
			</div>

		</div>
	</div>
</template>


<script>
import store from "@/store"
import { getIndexById } from "@/store/storeUtils"
const fs = require("fs")
const fse = require("fs-extra")
const path = require("path")

export default {
	name: "tools-widget",

	data() {
		return {
			dialogDirVisible: false,
			dialogFileVisible: false,
			dialogRenameVisible: false,
			confDeleteVisible: false,
			dirs: [],
			files: [],
		}
	},

	methods: {
		openDirDialog() {
			this.dialogDirVisible = true;
			this.dirs = store.state.tabs[getIndexById(store.state.activeTabId)].dirs;
			this.files = store.state.tabs[getIndexById(store.state.activeTabId)].files;
		},

		openFileDialog() {
			this.dialogFileVisible = true;
			this.dirs = store.state.tabs[getIndexById(store.state.activeTabId)].dirs;
			this.files = store.state.tabs[getIndexById(store.state.activeTabId)].files;
		},

		openRenameDialog() {
			this.dialogRenameVisible = true;
			this.dirs = store.state.tabs[getIndexById(store.state.activeTabId)].dirs;
			this.files = store.state.tabs[getIndexById(store.state.activeTabId)].files;
		},

		closeDialog() {
			this.dialogDirVisible = false;
			this.dialogFileVisible = false;
			this.dialogRenameVisible =  false;
			this.confDeleteVisible =  false;
		},

		paste() {
			const currPath = store.state.activeTabPath;
			const index = getIndexById(store.state.activeTabId);

			if (store.state.toPaste == "cut") {
				for (let dir of store.state.copiedDirs.values()) {
					try {
						fs.renameSync(dir, path.join(currPath, path.basename(dir)));
						store.commit("updateTab", currPath);
					}
					catch (err) {
						store.commit("updateWarning", "You cant cut those folders");
					}
				}

				for (let file of store.state.copiedFiles.values()) {
					try {
						fs.renameSync(file, path.join(currPath, path.basename(file)));
						store.commit("updateTab", currPath);
					}
					catch (err) {
						store.commit("updateWarning", "You cant cut those files");
					}
				}

				store.commit("clearCopied");
			}

			else {
				for (let dir of store.state.copiedDirs.values()) {
					let newDirName = path.basename(dir);
					let addition = 0;

					while (!this.isCopingValidHere(newDirName))
						newDirName = `(${addition++}) ` + path.basename(dir);

					newDirName = path.join(currPath, newDirName);
					
					try {
						fs.mkdirSync(newDirName);
						fse.copy(dir, newDirName, err => { if (err) return; });
						store.commit("updateTab", currPath);
					}
					catch (err) {
						store.commit("updateWarning", "You cant copy those folders or paste here");
						try {
							fs.rmSync(newDirName, { recursive: true, force: true });
						}
						catch (er) {}
					}
				}

				for (let file of store.state.copiedFiles.values()) {
					let newFileName = path.basename(file);
					let addition = 0;

					while (!this.isCopingValidHere(newFileName))
						newFileName = `(${addition++}) ` + path.basename(file);

					try {
						fs.copyFileSync(file, path.join(currPath, newFileName));
						store.commit("updateTab", currPath);
					}
					catch (err) {
						store.commit("updateWarning", "You cant copy those files or paste here");
					}
				}
			}
		},

		isCopingValidHere(name) {
            let index = getIndexById(store.state.activeTabId);

            for (let dir of store.state.tabs[index].dirs)
                if (name == dir.name) 
                    return false;

            for (let file of store.state.tabs[index].files)
                if (name == (file.name + file.ext)) 
                    return false;

            return true;
        },


        openDeleteConf() {
			this.confDeleteVisible = true;
		},
	},
}
</script>


<style scoped>

.col-1 {
	padding: 0 0.5vw;
}

* {
	margin: 0;
	padding: 0;
}

.btn-wrapper {	
	height: 2.3em;
}

.icon {
	width: 0.9em;
	height: 0.9em;
	user-select: none;
}

.btn-title {
	font-family: 'Arsenal', sans-serif;
	font-size: min(1.2vw, 0.9em);
	line-height: min(1.2vw, 0.9em);
	cursor: pointer;
	user-select: none;
}

</style>