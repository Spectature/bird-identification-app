<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  const token = uni.getStorageSync("userToken");
  if (!token) {
    // 如果没有 Token，跳转到登录页
    uni.reLaunch({
      url: "/pages/register",
    });
  }
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "nutui-uniapp/styles/index.scss";
</style>
