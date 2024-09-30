<script setup lang="ts">
import { computed } from "@vue/runtime-core";

const tabSwitch = (item: any, index: number) => {
  switch (item.tabTitle) {
    case "首页":
      uni.navigateTo({
        url: "/pages/index",
      });
      break;
    case "ai识鸟":
      uni.navigateTo({
        url: "/pages/identification-bird",
      });
      break;
    case "今日分享":
      uni.navigateTo({
        url: "/pages/index",
      });
      break;
    case "鸟窝探秘":
      uni.navigateTo({
        url: "/pages/index",
      });
      break;
    case "我的":
      uni.navigateTo({
        url: "/pages/index",
      });
      break;
    default:
      uni.navigateTo({
        url: "/pages/index",
      });
      break;
  }
};

// 定义组件的 props
const props = defineProps({
  currentIndex: {
    type: Number,
    default: 0,
  },
});

const innerIndex = computed(() => {
  return props.currentIndex;
});
</script>

<template>
  <nut-tabbar v-model="innerIndex" @tab-switch="tabSwitch">
    <nut-tabbar-item tab-title="首页" icon="home"></nut-tabbar-item>
    <nut-tabbar-item tab-title="ai识鸟" icon="category"> </nut-tabbar-item>
    <nut-tabbar-item tab-title="今日分享" icon="find"></nut-tabbar-item>
    <nut-tabbar-item tab-title="鸟窝探秘" icon="cart"></nut-tabbar-item>
    <nut-tabbar-item tab-title="我的" icon="my"></nut-tabbar-item>
  </nut-tabbar>
</template>

<style scoped></style>
