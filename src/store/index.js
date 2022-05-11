import { createStore } from "vuex"
import { updating, getIndexById, getTabName, clearWarning, isSameLocal } from "@/store/storeUtils"
const fs = require("fs")
const path = require("path")


export default createStore({
    state: {
        activeTabId: -1,
        uniqueId: 0,
        nTabs: 0,
        activeTabPath: "",
        volumes: [],
        tabs: [],

        toPaste: "",
        copiedDirs: [],
        copiedFiles: [],

        infoMessage: "",
        infoWarning: "",
        isThereWarning: false,

        localFoundedDirs: [],
        localFoundedFiles: [],

        searchInProcess: false,
    },


    getters: {
        activeTabIndex(state) {
            return getIndexById(state.activeTabId);
        },

        activeTabName(state) {
            return getTabName(state.activeTabId);
        },

        currSplittedPath(state) {
            let fullPath = state.tabs[getIndexById(state.activeTabId)].currPath;
            let splittedPath = [{name: "Root", revIndex: 0},];
            
            if (fullPath != "") {
                splittedPath.push({name: fullPath[0], revIndex: 0});
                fullPath = fullPath.slice(3);
            }

            let pathItem = "";
            for (let ltr of fullPath) {
                if (ltr != '/' && ltr != '\\')
                    pathItem += ltr;
                else {
                    if (pathItem != "")
                        splittedPath.push({name: pathItem, revIndex: 0});
                    pathItem = "";
                }
            }
            if (pathItem != "")
                splittedPath.push({name: pathItem, revIndex: 0});

            let lastRevIndex = 0;
            for (let i = splittedPath.length - 1; i >= 0; --i)
                splittedPath[i].revIndex = lastRevIndex++;

            return splittedPath;
        },

        countChoicedItems(state) {
            let index = getIndexById(state.activeTabId);
            return state.tabs[index].choicedDirs.size + state.tabs[index].choicedFiles.size;
        },

        countCopiedItems(state) {
            return state.copiedDirs.length + state.copiedFiles.length;
        },

        ableToCopyHere(state) {
            for (let dir of state.copiedDirs.values())
                if (state.activeTabPath.startsWith(dir))
                    return false;
            return true;
        },

        assertSearching(state) {
            if (state.tabs[getIndexById(state.activeTabId)].searchQuery != "")
                return true;
            return false;
        },

        currSearchQuery(state) {
            return state.tabs[getIndexById(state.activeTabId)].searchQuery;
        },

        assertGoto(state) {
            let query = state.tabs[getIndexById(state.activeTabId)].searchQuery;
            if (fs.existsSync(query))
                return true;

            return false;
        },

        goto(state) {
            let query = state.tabs[getIndexById(state.activeTabId)].searchQuery;
            
            let isDir = false;
            try {
                if (fs.statSync(query).isDirectory())
                    isDir = true;
            }
            catch(err){}

            let accessible = false;
            if (isDir) {
                try {
                    fs.readdirSync(query);
                    accessible = true;
                }
                catch(err){}
            }
            else {
                try {
                    fs.statSync(query).size;
                    accessible = true;
                }
                catch(err){}
            }

            let name = path.basename(query);
            if (name == "")
                name = query[0];

            if (accessible && !isDir)
                query = path.dirname(query);

            return { name: name, path: query, access: accessible, isDir: isDir };
        },

        wasLocalFoundedAny(state) {
            return (state.localFoundedDirs.length || state.localFoundedFiles.length);
        }
    },


    mutations: {
        async startUpdating(state) {
            // await setInterval(updating, 1000);
        },

        // volumes
        initVolumes(state) {
            for (let vol of "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
                if (fs.existsSync(`${vol}:`))
                    state.volumes.push(vol);
        },


        // tabs
        initTab(state, tabIndex) {
            for (let vol of state.volumes) {
                let details = "";
                try {
                    let objects = fs.readdirSync(`${vol}:/`).length;
                    details = `${objects} objects`;
                }
                catch (err) {}

                state.tabs[tabIndex].dirs.push({ name: vol, access: true, details: details });
            }
        },

        createTab(state) {
            state.tabs.push({ id: state.uniqueId,
                              currPath: "",
                              tabName: "Root",
                              dirs: [],
                              files: [], 
                              choicedDirs: new Set(),
                              choicedFiles: new Set(),
                              searchQuery: "",
                              globalFoundedDirs: new Set(),
                              globalFoundedFiles: new Set(), });

            this.commit("activateTabByIndex", state.nTabs);
            this.commit("initTab", state.nTabs);
            this.commit("updateInfo");

            state.uniqueId++;
            state.nTabs++;
        },

        closeTab(state, tabId) {
            let tabIndex = getIndexById(tabId);
            state.tabs.splice(tabIndex, 1);
            state.nTabs--;

            if (state.nTabs == 0)
                this.commit("createTab");
            else if (state.activeTabId == tabId)
                this.commit("activateTabByIndex", ((tabIndex == 0) ? (0) : (tabIndex - 1)));
        },

        activateTabById(state, tabId) {
            state.activeTabId = tabId;
            state.activeTabPath = state.tabs[getIndexById(tabId)].currPath;

            state.searchInProcess = false;
            this.commit("localDirsSearch");
            this.commit("localFilesSearch");
        },
        activateTabByIndex(state, tabIndex) {
            state.activeTabId = state.tabs[tabIndex].id;
            state.activeTabPath = state.tabs[tabIndex].currPath;

            state.searchInProcess = false;
            this.commit("localDirsSearch");
            this.commit("localFilesSearch");
        },


        // Dirs and Files
        updateTab(state, newPath) {
            let activeTab = state.tabs[getIndexById(state.activeTabId)];

            if (newPath == "") {
                activeTab.dirs = [];
                activeTab.files = [];
                this.commit("initTab", getIndexById(state.activeTabId));

                if (activeTab.currPath != newPath) {
                    activeTab.choicedDirs.clear();
                    activeTab.choicedFiles.clear();
                }

                activeTab.currPath = "";
                state.activeTabPath = "";
                activeTab.tabName = "Root";
                this.commit("updateInfo");

                return;
            }

            let items = fs.readdirSync(newPath);

            activeTab.dirs = [];
            activeTab.files = [];

            for (let item of items) {
                let accessible = false;
                let details = ""
                try {
                    let objects = fs.readdirSync(path.join(newPath, item)).length;
                    details = `${objects} objects`;
                    accessible = true;
                }
                catch (err) {}

                try {
                    if (fs.statSync(path.join(newPath, item)).isDirectory())
                        activeTab.dirs.push({ name:    item,
                                              access:  accessible,
                                              details: details });
                    else {
                        let weight = 0;
                        let measure = "B"

                        try {
                            weight += fs.statSync(path.join(newPath, item)).size;
                        }
                        catch (err) {}

                        if (weight > 1024) {
                            weight /= 1024;
                            measure = "kB"
                        }
                        if (weight > 1024) {
                            weight /= 1024;
                            measure = "mB"
                        }
                        if (weight > 1024) {
                            weight /= 1024;
                            measure = "gB"
                        }
                        if (weight > 1024) {
                            weight /= 1024;
                            measure = "tB"
                        }
                        activeTab.files.push({ name:     path.parse(item).name,
                                               ext:      path.parse(item).ext,
                                               details: `${Math.round(weight)} ${measure}` });
                    }
                }
                catch (err) {
                    activeTab.dirs.push({ name:    item,
                                          access:  false,
                                          details: "" });
                }
            }


            if (activeTab.currPath != newPath) {
                activeTab.choicedDirs.clear();
                activeTab.choicedFiles.clear();
            }

            activeTab.currPath = newPath;
            state.activeTabPath = newPath;

            activeTab.tabName = path.basename(newPath);
            if (activeTab.tabName == "")
                activeTab.tabName = newPath[0];

            this.commit("updateInfo");
        },

        stepInside(state, dirName) {
            let activeTab = state.tabs[getIndexById(state.activeTabId)];
            let newPath = "";

            if (activeTab.currPath == "")
                newPath = `${dirName}:\\`;
            else
                newPath = path.join(activeTab.currPath, dirName);

            try {
                this.commit("updateTab", newPath);
            }
            catch (err) {}
        },

        stepOutside(state, steps) {
            if (steps == 0) return;

            let activeTab = state.tabs[getIndexById(state.activeTabId)];
            let newPath = activeTab.currPath;
            let dirName = "";
            
            if (newPath.length <= 3) {
                newPath = "";
                dirName = "root";
            }

            else {
                for (let i = 0; i < steps && newPath != ""; ++i) {
                    if (newPath.length <= 3)
                        newPath = "";
                    else
                        newPath = path.dirname(newPath);
                }

                if (newPath.length == 0)
                    dirName = "root";
                else if (newPath.length <= 3) 
                    dirName = newPath[0];
                else
                    dirName = path.basename(newPath);
            }

            try {
                this.commit("updateTab", newPath);
            }
            catch (err) {}
        },


        // choice
        updateChoicedDirs(state, dir) {
            if (dir.add == true)
                state.tabs[getIndexById(state.activeTabId)].choicedDirs.add(dir.name);
            else
                state.tabs[getIndexById(state.activeTabId)].choicedDirs.delete(dir.name);
            this.commit("updateInfo");
        },
        updateChoicedFiles(state, file) {
            if (file.add == true)
                state.tabs[getIndexById(state.activeTabId)].choicedFiles.add(file.name);
            else
                state.tabs[getIndexById(state.activeTabId)].choicedFiles.delete(file.name);
            this.commit("updateInfo");
        },
        clearChoiced(state) {
            let index = getIndexById(state.activeTabId);
            state.tabs[index].choicedDirs.clear();
            state.tabs[index].choicedFiles.clear();
        },


        // coping
        updateCopied(state, mode) {
            state.copiedDirs = [];
            state.copiedFiles = [];

            let index = getIndexById(state.activeTabId);

            for (let dir of state.tabs[index].choicedDirs.values())
                state.copiedDirs.push(path.join(state.activeTabPath, dir));

            for (let file of state.tabs[index].choicedFiles.values())
                state.copiedFiles.push(path.join(state.activeTabPath, file));

            state.toPaste = mode;
        },
        clearCopied(state) {
            state.copiedDirs = [];
            state.copiedFiles = [];
        },


        // info
        updateInfo(state) {
            state.infoMessage = "";
            let index = getIndexById(state.activeTabId);

            if (state.tabs[index].choicedFiles.size != 0) {
                let filesWeight = 0;
                let measure = "B"

                for (let file of state.tabs[index].choicedFiles.values()) {
                    try {
                        filesWeight += fs.statSync(path.join(state.activeTabPath, file)).size;
                    }
                    catch (err) {}
                }

                if (filesWeight > 1024) {
                    filesWeight /= 1024;
                    measure = "kB"
                }
                if (filesWeight > 1024) {
                    filesWeight /= 1024;
                    measure = "mB"
                }
                if (filesWeight > 1024) {
                    filesWeight /= 1024;
                    measure = "gB"
                }
                if (filesWeight > 1024) {
                    filesWeight /= 1024;
                    measure = "tB"
                }

                state.infoMessage += `Size: ${Math.round(filesWeight)} ${measure}`
            }

            if (state.infoMessage == "")
                state.infoMessage += `Folders: ${state.tabs[index].dirs.length}. Files: ${state.tabs[index].files.length}. `
        },

        async updateWarning(state, warn) {
            state.infoWarning = warn;
            state.isThereWarning = true;
            setTimeout(clearWarning, 5000);
        },

        updateSearchQuery(state, query) {
            let query_len = query.length;

            while (query[query_len - 1] == "\\" || query[query_len - 1] == "/") {
                query = query.slice(0, -1);
                query_len--;
            }

            state.tabs[getIndexById(state.activeTabId)].searchQuery = query;
            this.commit("localDirsSearch");
            this.commit("localFilesSearch");
        },

        localDirsSearch(state) {
            state.localFoundedDirs = [];
            let index = getIndexById(state.activeTabId);
            let query = state.tabs[getIndexById(state.activeTabId)].searchQuery;

            for (let dir of state.tabs[index].dirs) {
                if (isSameLocal(query, dir.name))
                    state.localFoundedDirs.push(dir);
            }
        },

        localFilesSearch(state) {
            state.localFoundedFiles = [];
            let index = getIndexById(state.activeTabId);
            let query = state.tabs[getIndexById(state.activeTabId)].searchQuery;

            for (let file of state.tabs[index].files) {
                if (isSameLocal(query, file.name + file.ext))
                    state.localFoundedFiles.push(file);
            }
        },
    },
})
