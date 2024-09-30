import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import { NutResolver } from "nutui-uniapp";
import AutoImport from "unplugin-auto-import/vite";
import postcsspxtoviewport from "postcss-px-to-viewport";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UniComponents({
      resolvers: [NutResolver()],
    }),
    AutoImport({
      imports: ["vue"],
      dts: "types/auto-imports.d.ts",
    }),
    uni(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "nutui-uniapp/styles/variables.scss";`,
      },
    },
    // postcss: {
    //   plugins: [
    //     postcsspxtoviewport({
    //       unitToConvert: "px", // 要转化的单位
    //       viewportWidth: 750, // UI设计稿的宽度
    //       viewportHeight: 1000,
    //       unitPrecision: 5, // 转换后的精度，即小数点位数
    //       propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
    //       viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
    //       fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
    //       selectorBlackList: ["ignore-"], // 指定不转换为视窗单位的类名，
    //       minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
    //       mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
    //       replace: true, // 是否转换后直接更换属性值
    //       landscape: false, // 是否处理横屏情况
    //     }),
    //   ],
    // },
  },
});
