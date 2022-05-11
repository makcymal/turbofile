<template>
	<div class="results-list">

		<div v-if="$store.getters.assertGoto">

			<p v-if="goto.access" class="verdict h1">
				Go to:
			</p>
			<p v-else class="verdict h1">
				Cant go to:
			</p>

			<div class="line">
				<inline-file
					v-bind:fromSearch="true"
					v-bind:access="goto.access"
					v-bind:isChoiced="false"
					v-bind:isDir="goto.isDir"
					v-bind:name="goto.name"
					v-on:dblclick="gotoClick"
				></inline-file>
			</div>

		</div>

		<div v-else>

			<p class="verdict h1">
				The query is not an existing path
			</p>

			<p v-if="$store.getters.wasLocalFoundedAny" class="verdict h1">
				Founded in current folder:
			</p>
			<p v-else class="verdict h1">
				Nothing was found in current folder
			</p>
			
			<div>
				<div v-for="dir in $store.state.localFoundedDirs" class="line">
					<inline-file
						v-bind:fromSearch="true"
						v-bind:access="dir.access"
						v-bind:isChoiced="false"
						v-bind:isDir="true"
						v-bind:name="dir.name"
						v-bind:details="dir.details"
						v-on:dblclick="openDir(dir.name)"
					></inline-file>
				</div>

				<div v-for="file in $store.state.localFoundedFiles" class="line">
					<inline-file
						v-bind:fromSearch="true"
						v-bind:access="true"
						v-bind:isChoiced="false"
						v-bind:isDir="false"
						v-bind:name="file.name"
						v-bind:ext="file.ext"
						v-bind:details="file.details"
						v-on:dblclick="openFile(file.name + file.ext)"
					></inline-file>
				</div>
			</div>

			<div class="global-search-cont">
				<div class="global-search-btn">
					<mega-button
				  	v-on:clicked="startGlobal"
				  	v-bind:active="true"
				  	>
		                <img src="@/icons/globe.svg" class="icon" style="user-select: none;">
				  		<p class="btn-title">Try global search. This may take a while</p>
		            </mega-button>

					<div class="spinner-grow" role="status"></div>
				</div>
			</div>

			<div v-for="dir in $store.state.tabs[$store.getters.activeTabIndex].globalFoundedDirs.values()" class="line">
				<inline-file
					v-bind:fromSearch="true"
					v-bind:access="true"
					v-bind:isChoiced="false"
					v-bind:isDir="true"
					v-bind:name="dir"
					v-on:dblclick="forceOpenDir(dir)"
				></inline-file>
			</div>
			<div v-for="file in $store.state.tabs[$store.getters.activeTabIndex].globalFoundedFiles.values()" class="line">
				<inline-file
					v-bind:fromSearch="true"
					v-bind:access="true"
					v-bind:isChoiced="false"
					v-bind:isDir="false"
					v-bind:name="file"
					v-on:dblclick="forceOpenFile(file)"
				></inline-file>
			</div>
		</div>

	</div>
</template>


<script>
import store from "@/store"
import { getIndexById, searchEverywhere } from "@/store/storeUtils"
import InlineFile from "@/components/InlineFile"
const path = require("path")
const open = require("open")

export default {
	name: "results-widget",

	components: {
		InlineFile,
	},

	data() {
		return {
		}
	},

	props: {
		goto: {
			type: Object,
		}
	},

	methods: {
		gotoClick() {
			if (!this.goto.access) return;
			store.commit("updateTab", this.goto.path + '/');
			store.commit("updateSearchQuery", "");
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedDirs.clear();
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedFiles.clear();
		},

		openDir(dir) {
			store.commit('stepInside', dir);
			store.commit("updateSearchQuery", "");
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedDirs.clear();
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedFiles.clear();
		},

		forceOpenDir(dirPath) {
			store.commit("updateTab", dirPath);
			store.commit("updateSearchQuery", "");
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedDirs.clear();
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedFiles.clear();
		},

		async openFile(file) {
			try {
				await open(path.join(store.state.activeTabPath, file));
			}
			catch (err) {}
		},

		async forceOpenFile(filePath) {
			try {
				await open(filePath);
			}
			catch (err) {}
		},

		startGlobal() {
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedDirs.clear();
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedFiles.clear();
			store.state.searchInProcess = true;
			searchEverywhere(store.state.activeTabPath);
		},
	}
}
</script>


<style scoped>

.results-list {
	width: 100%;
	height: 100%;
}

.verdict {
	margin: 0;
	padding: 0.5em 2em;
	font-family: 'Exo 2';
	font-size: 1em;
	user-select: none;
}

.line {
	border-top: #adb5bd solid 1px;
	border-left: #adb5bd solid 1px;
	border-right: #adb5bd solid 1px	;
	border-bottom: 0;
}

.line:last-child {
	border-bottom: #adb5bd solid 1px;
}


.btn-title {
	font-family: 'Arsenal', sans-serif;
	font-size: min(1.5vw, 1.2em);
	line-height: min(1.5vw, 1.2em);
	cursor: pointer;
	user-select: none;
	margin: 0;
}

.global-search-cont {
	width: 100%;
	margin: 2em 0;
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.global-search-btn {
	width: 50%;
	height: 4em;
	position: relative;
}


.spinner-grow {
	width: 1em;
	height: 1em;
	background-color: #f037a5;
	position: absolute;
	top: calc(50% - 0.5em);
	right: -2em;
}

</style>