import { createRouter, createWebHistory } from "vue-router";
import CatalogView from "./views/CatalogView.vue";
import HistoryView from "./views/HistoryView.vue";
import TodayView from "./views/TodayView.vue";
import WeekView from "./views/WeekView.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "today", component: TodayView },
    { path: "/week", name: "week", component: WeekView },
    { path: "/history", name: "history", component: HistoryView },
    { path: "/plants", name: "catalog", component: CatalogView },
    { path: "/:rest(.*)*", redirect: "/" },
  ],
  scrollBehavior: () => ({ top: 0 }),
});
