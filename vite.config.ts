import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import { NutResolver } from "nutui-uniapp";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UniComponents({
      resolvers: [NutResolver()],
    }),
    uni(),
  ],
});
