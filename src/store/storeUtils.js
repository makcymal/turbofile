const fs = require("fs")
const path = require("path")
import store from "@/store"


export function updating() {
    store.commit("updateTab", store.state.activeTabPath);
}

export function getIndexById(tabId) {
    let i = 0;
    for (let tab of store.state.tabs) {
        if (tab.id == tabId)
            return i;
        i++;
    }
}

export function getTabName(tabId) {
    let name = store.state.tabs[getIndexById(tabId)].currPath;
    if (name == "")
        return "root";
    else
        return path.basename(name);
}

export function clearWarning() {
    store.state.infoWarning = "";
    store.state.isThereWarning = false;
}

export function isSameLocal(str1, str2) {
    let len1 = str1.length;
    let len2 = str2.length;

    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    if (str2.includes(str1))
        return true;

    if (str1.includes(str2))
        return true;

    let ed = [];
    for (let j = 0; j <= len2; ++j) {
        ed.push([]);
        for (let i = 0; i <= len1; ++i)
            ed[j].push(0)
    }

    for (let j = 0; j <= len2; ++j) {
        for (let i = 0; i <= len1; ++i) {
            if (j == 0)
                ed[j][i] = i;
            else if (i == 0)
                ed[j][i] = j;

            else {
                let ins = ed[j-1][i] + 1;
                let del = ed[j][i-1] + 1;
                let rep = ed[j-1][i-1] + ((str1[i-1] != str2[j-1]) ? 1 : 0);

                ed[j][i] = ins;
                if (del < ins)
                    ed[j][i] = del;
                if (rep < ed[j][i])
                    ed[j][i] = rep;
            }
        }
    }

    if (ed[len2][len1] <= len2 * 0.5)
        return true;
    return false;
}


export function isSameGlobal(str1, str2) {
    if (str1 == "")
        return false;

    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    if (str2.includes(str1))
        return true;

    if (str1.includes(str2))
        return true;


    return false;
}



export function searchEverywhere(currPath) {
    if (store.state.searchInProcess == false) return;

    let index = getIndexById(store.state.activeTabId);
    let query = store.state.tabs[index].searchQuery;

    if (currPath == "")
        for (let vol of store.state.volumes)
            setTimeout(searchEverywhere, 1, `${vol}://`);

    else {
        try {
            let items = fs.readdirSync(currPath);

            if (isSameGlobal(path.basename(currPath), query))
                store.state.tabs[index].globalFoundedDirs.add(currPath);

            for (let item of items) {
                let nextPath = path.join(currPath, item);

                let isDir = true;
                let accessible = false;
                try {
                    let stats = fs.statSync(nextPath);
                    accessible = true;

                    if (!stats.isDirectory()) {
                        isDir = false;
                    }
                }
                catch (err) {}

                if (!isDir && accessible && isSameGlobal(item, query))
                    store.state.tabs[index].globalFoundedFiles.add(nextPath);

                if (accessible && isDir)
                    setTimeout(searchEverywhere, 1, nextPath);
            }
        }
        catch (err) {}
    }
}   