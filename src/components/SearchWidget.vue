<template>
	<div class="search-cont">
		<img src="@/icons/search.svg" class="icon">
		<input
			v-bind:value="query"
			v-on:input="onInput"
			type="text"
			placeholder="Search or Go to"
			class="search-input"
		>
		<div
			v-on:click="clearInput"
			class="clear"
		>×</div>
	</div>
</template>


<script>
import store from "@/store"
import { getIndexById } from "@/store/storeUtils"

export default {
	name: "search-widget",

	props: {
		query: {
			type: String,
			default: "",
		},
	},

	methods: {
		onInput(event) {
			store.commit("updateSearchQuery", event.target.value.trim());
			store.state.searchInProcess = false;
		},

		clearInput() {
			store.commit("updateSearchQuery", "");
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedDirs.clear();
			store.state.tabs[getIndexById(store.state.activeTabId)].globalFoundedFiles.clear();
			store.state.searchInProcess = false;
		},
	},
}
</script>


<style scoped>

.search-cont {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	position: relative;
}

.icon {
	width: 1em;
	height: 1em;
	margin-right: 0.5em;
}

.search-input {
	width: calc(100% - 1.5em);
	height: 100%;
	font-family: 'Exo 2';
	font-size: 1em;
	border: 0;
	border-bottom: 2px solid #adb5bd;
	outline: none;
	transition: all 0.4s ease;
}

	.search-input:focus {
		border-bottom: 2px solid #f037a5;
	}

.clear {
	position: absolute;
	top: 0;
	right: 0;
	height: calc(100% - 5px);
	font-size: 1.8em;
	padding-right: 0.5em;
	color: black;
	background-color: white;
	cursor: pointer;
	transition: all 0.4s ease;
	opacity: 0.7;

	display: flex;
	flex-direction: row;
	align-items: center;
}

.clear:hover {
	color: #f037a5;
}

</style>