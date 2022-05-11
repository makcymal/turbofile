<template>
	<div v-if="$store.state.activeTabId == tabId" class="tab-cont active">
		<p class="tab-name h1" v-on:click="$store.commit('activateTabById', tabId)">{{ tabName }}</p>
		<button class="close-tab" v-on:click="$store.commit('closeTab', tabId)">×</button>
	</div>

	<div v-else class="tab-cont">
		<p class="tab-name h1" v-on:click="$store.commit('activateTabById', tabId)">{{ tabName }}</p>
		<button class="close-tab" v-on:click="$store.commit('closeTab', tabId)">×</button>
	</div>
</template>


<script>
export default {
	name: "tab-link",

	props: {
		tabId: {
			type: Number,
			required: true,
		},
		tabName: {
			type: String,
		},
	},
}
</script>


<style scoped>

.tab-cont {
	height: 100%;
	margin: 0 0.2em;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	background-color: white;
	border: 2px solid #adb5bd;
	opacity: 1;
	transition: all 0.4s ease;
}

.tab-cont:hover {
	border: 2px solid #f037a5;
}

.tab-cont.active {
	background-color: #cdf564;
	border: 2px solid #cdf564;
}

.tab-cont.active:hover {
	background-color: #daf564;
	border: 2px solid #daf564;
}

.tab-name {
	margin: auto;
	font-family: 'Exo 2';
	font-size: 1em;
	line-height: 1em;
	color: black;
	padding: 0 0.5em;
	white-space: nowrap;
	cursor: pointer;
	user-select: none;
}

.close-tab {
	margin: auto;
	background-color: transparent;
	border: 0;
	font-size: 1em;
	line-height: 1em;
	color: black;
	padding: 0 0.5em;
}

.close-tab:hover {
	color: gray;
}
	
</style>