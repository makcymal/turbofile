<template>
	<div v-if="active" v-on:click="$emit('clicked')" class="mega-btn">
		<slot></slot>
	</div>

	<div v-else class="mega-btn disabled">
		<slot></slot>
	</div>
</template>


<script>
export default {
	name: "mega-button",

	props: {
		active: {
			type: Boolean,
			default: false,
		}
	},
}
</script>


<style scoped>

.mega-btn {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;

	opacity: 1;
	background-color: #cdf564;
	border-radius: 0.3em;
	transition: all 0.4s ease;
}

.mega-btn.disabled {
	opacity: 0.6;
}

.mega-btn:hover {
	background-color: #daf564;
}

.mega-btn.disabled:hover {
	opacity: 0.6;
	background-color: #cdf564;
}

</style>