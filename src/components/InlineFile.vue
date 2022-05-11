<template>

	<div v-if="fromSearch">
		
		<div v-if="access">

			<div v-if="details">

				<div v-if="isDir">

					<button class="file-row peaky">
						<div class="choice">
							<div class="target"></div>
						</div>
						<img src="@/icons/folder.svg" class="folder">	
						<div class="file-cont">
							<p class="file-name lr h1">{{name}}{{ext}}</p>
							<p class="file-details h1">{{details}}</p>
						</div>
					</button>

				</div>

				<div v-else> <!-- is file -->
					
					<button class="file-row peaky">
						<div class="choice">
							<div class="target"></div>
						</div>		
						<div class="file-cont">
							<p class="file-name r h1">{{name}}{{ext}}</p>
							<p class="file-details h1">{{details}}</p>
						</div>
					</button>

				</div> 
				
			</div>

			<div v-else> <!-- there are no details -->
				
				<div v-if="isDir">
				
					<button class="file-row peaky">
						<div class="choice">
							<div class="target"></div>
						</div>
						<img src="@/icons/folder.svg" class="folder">
						<div class="file-cont">
							<p class="file-name l h1">{{name}}{{ext}}</p>
						</div>
					</button>

				</div>

				<div v-else> <!-- is file -->
					
					<button class="file-row peaky">
						<div class="choice">
							<div class="target"></div>
						</div>		
						<div class="file-cont">
							<p class="file-name h1">{{name}}{{ext}}</p>
						</div>
					</button>

				</div>

			</div>

		</div>

		<div v-else> <!-- there is no access -->
			
			<button class="file-row disabled">
				<div class="choice">
					<div
					v-on:dblclick.stop
					class="target disabled"
					></div>
				</div>
				<div class="file-cont">
					<p class="file-name h1">{{name}}{{ext}}</p>
				</div>
			</button>

		</div>

	</div>

	<div v-else> <!-- not from search -->
		
		<div v-if="access">
			
			<div v-if="isChoiced">
				
				<div v-if="isDir">

					<button class="file-row active">
						<div class="choice">
							<div
							v-on:click="choiced"
							v-on:dblclick.stop
							class="target active"
							></div>
						</div>
						<img src="@/icons/folder.svg" class="folder">	
						<div
						v-on:click="choicedOne"
						class="file-cont"
						>
							<p class="file-name lr h1">{{name}}{{ext}}</p>
							<p class="file-details h1">{{details}}</p>
						</div>
					</button>

				</div>

				<div v-else> <!-- is file -->
					
					<button class="file-row active">
						<div class="choice">
							<div
							v-on:click="choiced"
							v-on:dblclick.stop
							class="target active"
							></div>
						</div>		
						<div
						v-on:click="choicedOne"
						class="file-cont"
						>
							<p class="file-name r h1">{{name}}{{ext}}</p>
							<p class="file-details h1">{{details}}</p>
						</div>
					</button>

				</div> 

			</div>

			<div v-else> <!-- is not choiced -->
				
				<div v-if="isDir">
					
					<button class="file-row">
						<div class="choice">
							<div
							v-on:click="choiced"
							v-on:dblclick.stop
							class="target"
							></div>
						</div>
						<img src="@/icons/folder.svg" class="folder">
						<div
						v-on:click="choicedOne"
						class="file-cont"
						>
							<p class="file-name lr h1">{{name}}{{ext}}</p>
							<p class="file-details h1">{{details}}</p>
						</div>
					</button>

				</div>

				<div v-else> <!-- is file -->
					
					<button class="file-row">
						<div class="choice">
							<div
							v-on:click="choiced"
							v-on:dblclick.stop
							class="target"
							></div>
						</div>
						<div
						v-on:click="choicedOne"
						class="file-cont"
						>
							<p class="file-name r h1">{{name}}{{ext}}</p>
							<p class="file-details h1">{{details}}</p>
						</div>
					</button>

				</div> 

			</div>

		</div>

		<div v-else> <!-- there is no access -->
			
			<button class="file-row disabled">
				<div class="choice">
					<div
					v-on:dblclick.stop
					class="target disabled"
					></div>
				</div>
				<div class="file-cont">
					<p class="file-name h1">{{name}}{{ext}}</p>
				</div>
			</button>

		</div>

	</div> 

</template>


<script>
import store from "@/store"

export default {
	name: "inline-file",

	props: {
		fromSearch: {
			type: Boolean,
			default: false,
		},

		access: {
			type: Boolean,
			default: false,
		},

		isChoiced: {
			type: Boolean,
			default: false,
		},

		isDir: {
			type: Boolean,
			default: true,
		},
		
		name: {
			type: String,
			default: "",
		},
		ext: {
			type: String,
			default: "",
		},

		details: {
			type: String,
			default: ""
		},
	},

	methods: {
		choiced() {
			if (this.fromSearch) return;

			if (this.isDir)
				this.choicedDir();
			else
				this.choicedFile();
		},

		choicedDir() {
			let add = true;
			if (this.isChoiced)
				add = false;

			store.commit('updateChoicedDirs', {name: this.name, add: add});
		},

		choicedFile() {
			let add = true;
			if (this.isChoiced)
				add = false;

			store.commit('updateChoicedFiles', {name: this.name + this.ext, add: add});
		},

		choicedOne() {
			if (this.fromSearch) return;

			if (this.isDir)
				this.choicedOneDir();
			else
				this.choicedOneFile();
		},

		choicedOneDir() {
			store.commit("clearChoiced");
			store.commit('updateChoicedDirs', {name: this.name, add: true});
		},

		choicedOneFile() {
			store.commit("clearChoiced");
			store.commit('updateChoicedFiles', {name: this.name + this.ext, add: true});
		},
	}
}
</script>


<style scoped>

.file-row {
	width: 100%;
	height: 3em;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	background-color: white;
	border: 0;
	transition: all 0.4s ease;
}

.file-row.peaky {
	border: 0;
}

.file-row:hover {
	background-color: whitesmoke;
}

.file-row.active {
	background-color: #cdf564;
}

.file-row.active:hover {
	background-color: #daf564;
}

.file-row.disabled {
	background-color: whitesmoke;
}

.file-row.disabled:hover {
	background-color: whitesmoke;
}

.choice {
	width: 3em;
	height: 3em;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.target {
	width: 1.2em;
	height: 1.2em;
	background-color: white;
	border: #cdf564 solid 0.3em;
	border-radius: 50%;
	transition: all 0.4s ease;
}

.target:hover {
	background-color: #cdf564;
}

.target.active {
	background-color: #cdf564;
	border: white solid 0.3em;
}

.target.active:hover {
	background-color: white;
}

.target.disabled {
	background-color: whitesmoke;
	border: #adb5bd solid 0.3em;
}

.target.disabled:hover {
	background-color: whitesmoke;
	border: #adb5bd solid 0.3em;
}

.file-cont {
	width: calc(100% - 3em);
	height: 3em;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}


.file-name {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 1em;
	font-family: 'Exo 2';
	font-size: 1em;
	line-height: 1em;
	color: black;
	white-space: nowrap;
	overflow: hidden;
	text-align: left;
}

.file-name.l {
	width: calc(100% - 2em);
}

.file-name.r {
	width: 85%;
}

.file-name.lr {
	width: calc(85% - 2em);
}

.file-name.disabled {
	color: #adb5bd;
}

.file-details {
	width: 15%;
	height: 100%;
	margin: 0;
	padding-right: 1em;
	font-family: 'Exo 2';
	font-size: min(2vw, 1em);
	color: black;
	white-space: nowrap;
	overflow: hidden;
	text-align: right;

	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.folder {
	width: 1em;
	height: 1em;
	margin-left: 1em;
}

</style>