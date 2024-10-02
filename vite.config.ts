import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import { NutResolver } from "nutui-uniapp";
import AutoImport from "unplugin-auto-import/vite";
import { fileURLToPath, URL } from "node:url";
// import postcsspxtoviewport from "postcss-px-to-viewport";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UniComponents({
      resolvers: [NutResolver()],
    }),
    uni(),
    AutoImport({
      imports: [
        "vue",
        {
          "@stellaround/request": [
            "publicRequests",
            "useGet",
            "usePost",
            "usePut",
            "useDelete",
            "publicMock",
            "mockGet",
            "mockPost",
            "mockPut",
            "mockDelete",
          ],
        },
      ],
      dts: "types/auto-imports.d.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
