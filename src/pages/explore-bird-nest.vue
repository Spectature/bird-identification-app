<script setup lang="ts">
import TabBar from "@/components/tab-bar.vue";
import MediaLoader from "@/components/media-loader.vue";
import { onLoad } from "@dcloudio/uni-app";

const type = ref("");
const src = ref("");

const res = ref();

let id;

onLoad(async (query: any) => {
  id = query.id;
  // 有id是从详情页跳转过来的，没有则是需要初始化，那返回呢？
  if (id) {
    res.value = await useGet("/aa", { id });
  } else {
    res.value = await useGet("/bb");
  }
});

const jumpSearch = () => {
  uni.navigateTo({
    url: "/pages/bird-search",
  });
};

setTimeout(() => {
  res.value = {
    name: "睚眦",
    family: "XX科",
    lang: "80cm",
    danger: "一级",
    env: "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充",
    habits:
      "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充",
    distribution:
      "填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充填充",
  };
});
</script>

<template>
  <view class="container">
    <view class="top">
      <view class="top">
        <media-loader :type="type" :src="src"></media-loader>
      </view>
      <view class="content">
        <view class="top">
          <view class="name">{{ res?.name }}</view>
          <view class="family">{{ res?.family }}</view>
        </view>
        <view class="middle">
          <view>{{ res?.lang }}</view>
          <view>{{ res?.danger }}</view>
          <view>zhanwei</view>
        </view>
        <view class="list">
          <view class="list-item">
            <view class="title">特征一：</view>
            <view>{{ res?.env }}</view>
          </view>
          <view class="list-item">
            <view class="title">特征一：</view>
            <view> {{ res?.habits }}</view>
          </view>
          <view class="list-item">
            <view class="title">特征一：</view>
            <view> {{ res?.distribution }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom"> <tab-bar :current-index="3"></tab-bar></view>
    <view class="fixed" @click="jumpSearch">
      <nut-icon name="search" />
    </view>
  </view>
</template>

<style scoped lang="less">
.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  .content {
    padding: 10rpx 50rpx;
    .top {
      padding: 40rpx 0;
    }
    .middle {
      display: flex;
      width: 100%;
      justify-content: space-around;
    }
    .list {
      margin-top: 20rpx;
      .list-item {
        padding: 10rpx 0;
      }
    }
  }
  .fixed {
    position: fixed;
    top: 50%;
    right: 20rpx;
  }
}
</style>
