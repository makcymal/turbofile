<template>

    <div class="add-tab">
        <mega-button v-on:click="$store.commit('createTab')" v-bind:active="true">
            <img src="@/icons/newtab.svg" style="user-select: none;">
        </mega-button>
    </div>
    
    <div class="scroller-x">
        <div class="tabs-row">
            <tab-link
                v-for="tab in $store.state.tabs"
                v-bind:tabId="tab.id"
                v-bind:tabName="tab.tabName"
            ></tab-link>
        </div>
        <div class="scrollbar"></div>
    </div>

</template>


<script>
import TabLink from "@/components/TabLink"

export default {
    name: "tabs-widget",

    components: {
        TabLink,
    },
}
</script>


<style scoped>

.add-tab {
    height: 2em;
    width: 2em;
    margin-right: 0.2em;
}

.scroller-x {
    width: calc(100% - 2.2em);
    height: 1.9em;
    position: relative;
}

.tabs-row {
    height: 1.9em;
    padding-bottom: 0.4em;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    overflow-x: overlay;
    overflow-y: hidden;
}

.scrollbar {
    width: calc(100% - 0.2em);
    height: 0.1em;
    bottom: 0;
    right: 0;
    position: absolute;
    background-color: #adb5bd;
    z-index: -1;
}

.tabs-row::-webkit-scrollbar {
  width: 0.2em;
  height: 0.2em;
}

.tabs-row::-webkit-scrollbar-thumb {
  background: #cdf564;
}

</style>
