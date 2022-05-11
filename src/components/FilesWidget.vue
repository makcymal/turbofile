<template>
	<div class="files-list">
		<div v-for="dir in $store.state.tabs[$store.getters.activeTabIndex].dirs" class="line">
			<inline-file
				v-bind:fromSearch="false"
				v-bind:access="dir.access"
				v-bind:isChoiced="$store.state.tabs[$store.getters.activeTabIndex].choicedDirs.has(dir.name)"
				v-bind:isDir="true"
				v-bind:name="dir.name"
				v-bind:details="dir.details"
				v-on:dblclick="openDir(dir.name)"
			></inline-file>
		</div>
		
		<div v-for="file in $store.state.tabs[$store.getters.activeTabIndex].files" class="line">
			<inline-file
				v-bind:fromSearch="false"
				v-bind:access="true"
				v-bind:isChoiced="$store.state.tabs[$store.getters.activeTabIndex].choicedFiles.has(file.name + file.ext)"
				v-bind:isDir="false"
				v-bind:name="file.name"
				v-bind:ext="file.ext"
				v-bind:details="file.details"
				v-on:dblclick="openFile(file)"
			></inline-file>
		</div>
	</div>
</template>


<script>
import store from "@/store"
import InlineFile from "@/components/InlineFile"
const path = require("path")
const open = require("open")

export default {
	name: "files-widget",

	components: {
		InlineFile,
	},

	methods: { 
		openDir(dir) {
			store.commit('stepInside', dir)
		},

		async openFile(file) {
			try {
				await open(path.join(store.state.activeTabPath, file.name + file.ext));
			}
			catch (err) {}
		},
	},
}
</script>


<style scoped>

.files-list {
	width: 100%;
	border: #adb5bd solid 1px;
	border-radius: 1em;
	overflow: hidden;
}

.line {
	border-bottom: 1px solid #adb5bd;
}

.line:last-child {
	border: 0;
}

</style>