<template>
	<div class="info-line">
		<p v-if="!$store.state.isThereWarning" class="info msg">{{$store.state.infoMessage}}</p>
		<p v-else class="info warn">{{$store.state.infoWarning}}</p>
	</div>
</template>


<script>
export default {
	name: "info-widget",
}
</script>


<style scoped>

.info-line {
	width: 100vw;
	height: 1.5em;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #e9ecef;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
}

.info {
	margin: 0;
	padding: 1px;
	font-family: 'Exo 2';
	font-size: 1em;
	line-height: 0.9em;
	color: black;
	white-space: nowrap;
}

.info.msg {
	border-bottom: 3px solid transparent;
}

.info.warn {
	border-bottom: 3px solid #f037a5;
}

</style>