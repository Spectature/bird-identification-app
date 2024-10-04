<script setup lang="ts">
import { ref } from "vue";
import MediaLoader from "../components/media-loader.vue";
import TabBar from "../components/tab-bar.vue";

const result = ref([
  {
    type: "image",
    src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    content: "1",
  },
  {
    type: "image",
    src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    content: "2",
  },
  {
    type: "image",
    src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    content: "3",
  },
]);
</script>

<template>
  <view class="container">
    <nut-swiper :init-page="0" :loop="false" direction="vertical">
      <nut-swiper-item v-for="(item, index) in result" :key="index">
        <view class="top">
          <view class="top">
            <media-loader :type="item.type" :src="item.src"></media-loader>
          </view>
          <view class="content">
            {{ item.content }}
          </view>
        </view>
      </nut-swiper-item>
    </nut-swiper>

    <view class="bottom"> <tab-bar :current-index="2"></tab-bar></view>
  </view>
</template>

<style scoped lang="less">
.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  .content {
    display: flex;
    justify-content: center;
  }
}
</style>
