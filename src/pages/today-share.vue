<script setup lang="ts">
import MediaLoader from "@/components/media-loader.vue";
import TabBar from "@/components/tab-bar.vue";

const type = ref("");
const src = ref("");
</script>

<template>
  <view class="container">
    <view class="top">
      <view class="top">
        <media-loader :type="type" :src="src"></media-loader>
      </view>
      <view class="content"></view>
    </view>

    <view class="bottom"> <tab-bar :current-index="2"></tab-bar></view>
  </view>
</template>

<style scoped lang="less">
.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
}
</style>
