<template>
	<div v-if="visible" v-on:click="closeDialog" class="bg"></div>
	<div v-if="visible" v-on:click.stop class="dialog">
		<p v-if="actionType == 'newdir'" class="title h1">New directory name:</p>
		<p v-else-if="actionType == 'newfile'" class="title h1">New file name:</p>
		<p v-else-if="actionType == 'rename'" class="title h1">New name:</p>

		<input v-on:input="validation" type="text" placeholder="Type..." class="input" autofocus>

		<div class="confirm">
			<p class="msg text-muted">{{validationMsg}}</p>

			<button v-if="isValid && actionType != 'rename'" v-on:click="create" class="btn">Create</button>
			<button v-else-if="!isValid && actionType != 'rename'" v-on:click="create" class="btn disabled">Create</button>
			<button v-else-if="isValid" v-on:click="rename" class="btn">Rename</button>
			<button v-else class="btn disabled">Rename</button>
		</div>
	</div>
</template>


<script>
import store from "@/store"
import { getIndexById } from "@/store/storeUtils"
const fs = require("fs")
const path = require("path")

export default {
	name: "dialog-widget",

	data() {
		return {
			isValid: false,
			validName: "",
			validationMsg: "",
		}
	},

	props: {
		actionType: {
			type: String,
			default: 'newdir',
		},
		visible: {
			type: Boolean,
			default: false,
		},
		dirs: {
			type: Array[Object],
			default: [],
		},
		files: {
			type: Array[Object],
			default: [],
		}
	},

	methods: {
		closeDialog() {
			this.isValid = false;
			this.validName = "";
			this.validationMsg = "";
			this.$emit("closeDialog");
		},

		validation(event) {
			const name = event.target.value.trim();

			if (name == "") {
				this.isValid = false;
				this.validName = "";
				this.validationMsg = "Please enter name";
				return;
			}

			for (let dir of this.dirs)
				if (name == dir.name) {
					this.isValid = false;
					this.validName = "";
					this.validationMsg = "This name is already taken";
					return;
				}

			for (let file of this.files)
				if (name == (file.name + file.ext)) {
					this.isValid = false;
					this.validName = "";
					this.validationMsg = "This name is already taken";
					return;
				}

			for (let ltr of name) {
				if (ltr == '\\' || ltr == '/' || ltr == '|' ||
					ltr == '?'  || ltr == '*' || ltr == '"' ||
					ltr == '<'  || ltr == '>' || ltr == ':') {
					this.isValid = false;
					this.validName = "";
					this.validationMsg = "Invalid literals";
					return;
				}
			}


			this.isValid = true;
			this.validName = name;
			this.validationMsg = "";
		},

		create() {
			const currPath = store.state.activeTabPath;

			if (this.actionType == 'newdir') {
				try {
					fs.mkdirSync(path.join(currPath, this.validName));
					store.commit("updateTab", currPath);
					this.closeDialog();
				}
				catch (err) {
					this.isValid = false;
					this.validName = "";
					this.validationMsg = "You have no access";
					store.commit("updateWarning", "No access to create folder here");
				}
			}

			else if (this.actionType == 'newfile') {
				try {
					fs.writeFileSync(path.join(currPath, this.validName), "");
					store.commit("updateTab", currPath);
					this.closeDialog();
				}
				catch (err) {
					this.isValid = false;
					this.validName = "";
					this.validationMsg = "You have no access";
					store.commit("updateWarning", "No access to create file here");
				}
			}	
		},

		rename() {
			const currPath = store.state.activeTabPath;
			let oldName = "";
			let index = getIndexById(store.state.activeTabId);

			for (let choicedName of store.state.tabs[index].choicedDirs.values())
				oldName += choicedName;
			for (let choicedName of store.state.tabs[index].choicedFiles.values())
				oldName += choicedName;

			try {
				fs.renameSync(path.join(currPath, oldName), path.join(currPath, this.validName));
				store.commit("updateTab", currPath);
				this.closeDialog();
				store.commit("clearChoiced");
			}
			catch (err) {
				this.isValid = false;
				this.validName = "";
				this.validationMsg = "You have neither access nor luck(";
			}
		}
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

.dialog {
	position: absolute;
	width: 50vw;
	height: 40vh;
	top: 30%;
	left: 25%;
	z-index: 100;
	padding: 7vh 5vw;
	background-color: whitesmoke;
	border-radius: 1em;
}

.title {
	font-size: min(5vh, 2em);
	margin: 0;
	padding: 0;
}

.input {
	width: 100%;
	margin: min(3vh, 2em) 0;
	font-size: min(3vh, 1.2em);
}

.confirm {
	width: 100%;
	margin: min(3vh, 2em) 0;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}

.msg {
	font-size: min(2.2vh, 1em);
	line-height: min(2.2vh, 1em);
	margin: 0;
	padding-right: 2em;
}

.btn {
	background-color: #cdf564;
}

</style>