import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Toaster from '@meforma/vue-toaster';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserGraduate, faAt,faLock, faCircleInfo, faKey,
faUserSecret, 
faCircleUser,
faUsers,
faGraduationCap,
faClipboardList,
faArrowRightFromBracket,
faBars,
faUserGear,
faUser,
faPenToSquare,
faListUl,
faCircleArrowLeft,
faAngleDown,
faCircleExclamation} from "@fortawesome/free-solid-svg-icons";

library.add(faUserGraduate, faAt, faLock,faCircleInfo, faKey,
    faUserSecret, faCircleUser, faUsers,faGraduationCap,faClipboardList,
    faArrowRightFromBracket, faBars, faUserGear, faUser,faPenToSquare, faListUl, faCircleArrowLeft,faAngleDown, faCircleExclamation);

const app = createApp(App);
app.use(store)
app.use(router)
app.component("font-awesome-icon", FontAwesomeIcon)
app.use(Toaster, {position: 'top-right'})
app.mount('#app')
