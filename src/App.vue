<!-- ffffff white -->
<!-- cdf564 citric -->
<!-- daf564 hovered citric -->
<!-- 4b917d mint -->
<!-- f037a5 fuchsia -->
<!-- e9ecef gray-200 -->
<!-- adb5bd gray-500 -->

<template>
    <div class="container-fluid">

        <div class="controls">TurboFile</div>

        <div class="wrapper tabs-wrapper">
            <tabs-widget></tabs-widget>
        </div>

        <div class="wrapper path-wrapper">
            <path-widget></path-widget>
        </div>

        <div class="wrapper search-wrapper">
            <search-widget v-bind:query="$store.getters.currSearchQuery"></search-widget>
        </div>

        <div v-if="$store.getters.assertSearching" class="wrapper results-wrapper">
            <results-widget v-bind:goto="$store.getters.goto"></results-widget>
        </div>

        <div v-else>
            <div class="wrapper tools-wrapper">
                <tools-widget></tools-widget>
            </div>

            <div class="wrapper files-wrapper">
                <files-widget></files-widget>
            </div>

            <div class="wrapper info-wrapper">
                <info-widget></info-widget>
            </div>
        </div>

    </div>


</template>


<script>
import store from "@/store"
import TabsWidget from "@/components/TabsWidget"
import PathWidget from "@/components/PathWidget"
import SearchWidget from "@/components/SearchWidget"
import ResultsWidget from "@/components/ResultsWidget"
import ToolsWidget from "@/components/ToolsWidget"
import FilesWidget from "@/components/FilesWidget"
import InfoWidget from "@/components/InfoWidget"


export default {
    name: "App",

    components: {
        TabsWidget, PathWidget, SearchWidget, ResultsWidget, ToolsWidget, FilesWidget, InfoWidget,
    },

    methods: {
        init() {
            store.commit("startUpdating");
            store.commit("initVolumes");
            store.commit("createTab");
        },
    },

    created() {
        this.init();
    },
}
</script>


<style>

@import url('https://fonts.googleapis.com/css2?family=Arsenal&family=Exo+2&display=swap');

* {
    user-select: none;
}

.wrapper {
    width: 100%;
    margin-top: 0.5em;
}

.controls {
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: flex-start;

    font-family: 'Exo 2', sans-serif;
    font-size: 16px;
}

.tabs-wrapper {
    height: 2em;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
}

.path-wrapper {
    height: 1.5em;
}

.search-wrapper {
    height: 2em;
}

.results-wrapper {
    /* page_height - tabs_height - path_height - search_height - self_margin_top_bottom_height */
    height: calc(100vh - 20px - 2.5em - 2em - 2.5em - 1em);
    overflow-y: overlay;
}

.results-wrapper::-webkit-scrollbar {
  width: 0.4em;
  height: 0.4em;
}
.results-wrapper::-webkit-scrollbar-thumb {
  background: #cdf564;
}

.tools-wrapper {
    height: 2.3em;
}

.files-wrapper {
    /* page_height - tabs_height - path_height - search_height - tools_height - self_margin_top_height - info-height */
    height: calc(100vh - 20px - 2.5em - 2em - 2.5em - 2.9em - 0.5em - 2em);
    overflow-y: overlay;
}

.files-wrapper::-webkit-scrollbar {
  width: 0.4em;
  height: 0.4em;
}
.files-wrapper::-webkit-scrollbar-thumb {
  background: #cdf564;
}

.info-wrapper {
    height: 1.5em;
    overflow: hidden;
}

</style>
