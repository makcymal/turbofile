import { createApp } from "vue"
import App from "@/App.vue"
import store from "@/store"
import UI from '@/components/UI';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"


let app = createApp(App);

UI.forEach(UiElem => {
	app.component(UiElem.name, UiElem);
})

app.use(store).mount("#app")
