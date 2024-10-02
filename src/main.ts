import { createSSRApp } from "vue";
import App from "./App.vue";
import { initRequest } from "@/request/request";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}

initRequest();
