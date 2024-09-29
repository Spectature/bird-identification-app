<template>
  <view class="content">
    <view class="container"></view>
    <view class="bottom">
      <tab-bar></tab-bar>
    </view>
  </view>
</template>

<script setup lang="ts">
import TabBar from "@/components/tab-bar.vue";
</script>

<style scoped>
.content {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
}
</style>
