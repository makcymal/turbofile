<template>
	<div v-if="visible" v-on:click="closeDialog" class="bg"></div>
	<div v-if="visible" v-on:click.stop class="conf">
		<p class="title h1">Are you sure?</p>
		<div class="btn-cont">
			<button v-on:click="remove" class="btn">Yes, delete</button>
		</div>
	</div>
</template>


<script>
import store from "@/store"
import { getIndexById } from "@/store/storeUtils"
const fs = require("fs")
const path = require("path")

export default {
	name: "mega-confirmation",

	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		closeDialog() {
			this.isValid = false;
			this.validName = "";
			this.validationMsg = "";
			this.$emit("closeDialog");
		},

		remove() {
        	const currPath = store.state.activeTabPath;
			const index = getIndexById(store.state.activeTabId);

			for (let dir of store.state.tabs[index].choicedDirs.values()) {
				try {
					fs.rmSync(path.join(currPath, dir), { recursive: true, force: true });
				}
				catch (err) {
					store.commit("updateWarning", "You cant delete these folders");
				}
			}

			for (let file of store.state.tabs[index].choicedFiles.values()) {
				try {
					fs.rmSync(path.join(currPath, file));
				}
				catch (err) {
					store.commit("updateWarning", "You cant delete these files");
				}
			}
			store.commit("updateTab", currPath);
			this.closeDialog();
        },
	}
}
</script>


<style scoped>

.bg {
	position: absolute;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
	z-index: 10;
	background-color: gray;
	opacity: 0.5;
}

.conf {
	position: absolute;
	width: 50vw;
	height: 20vh;
	top: 40%;
	left: 25%;
	z-index: 100;
	padding: 5vh 5vw;
	background-color: whitesmoke;
	border-radius: 1em;
}

.title {
	font-size: min(5vh, 2em);
	margin: 0;
	padding: 0;
}

.btn-cont {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.btn {
	background-color: #cdf564;
}

</style>