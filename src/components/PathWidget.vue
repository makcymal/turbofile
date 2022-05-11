<template>
	<nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"></li>
			<li v-for="pathItem in $store.getters.currSplittedPath"
				v-on:click="onClick(pathItem.revIndex)"
				class="breadcrumb-item">
					{{pathItem.name}}
			</li>
		</ol>
	</nav>
</template>


<script>
import store from "@/store"
import { getIndexById } from "@/store/storeUtils"

export default {
	name: "path-widget",

	methods: {
		onClick(revIndex) {
			store.commit('stepOutside', revIndex);
			store.commit("updateSearchQuery", "");
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedDirs.clear();
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedFiles.clear();
			store.state.searchInProcess = false;
		}
	},
}
</script>


<style scoped>

.breadcrumb-item {
	font-family: 'Arsenal', sans-serif;
	font-size: 1em;
	text-decoration: none;
	cursor: pointer;
	user-select: none;
}

.breadcrumb-item:hover {
	text-decoration: underline;
}

</style>