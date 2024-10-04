<script setup lang="ts">
import { ref } from "vue";
import TabBar from "../components/tab-bar.vue";
import MediaLoader from "../components/media-loader.vue";
import { onLoad } from "@dcloudio/uni-app";

const type = ref("");
const src = ref("");

const result = ref();

let id;

onLoad(async (query: any) => {
  id = query.id;
  // 有id是从详情页跳转过来的，没有则是需要初始化，那返回呢？
  if (id) {
    uni.request({
      url: "/aa", // API 地址
      method: "GET", // 使用 GET 方法
      data: {
        id,
      },
      success: (res) => {
        result.value = res;
        // console.log("成功:", res.data);
      },
      fail: (err) => {
        console.error("请求失败:", err);
      },
    });
  } else {
    uni.request({
      url: "https://example.com/api", // API 请求地址
      method: "GET", // 请求方式
      success: (res) => {
        result.value = res;
        // console.log(res); // 请求成功后的返回数据
      },
      fail: (err) => {
        console.error(err); // 请求失败时的错误信息
      },
    });
  }
});

const jumpSearch = () => {
  uni.navigateTo({
    url: "/pages/bird-search",
  });
};

setTimeout(() => {
  result.value = {
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
          <view class="name">{{ result?.name }}</view>
          <view class="family">{{ result?.family }}</view>
        </view>
        <view class="middle">
          <view>{{ result?.lang }}</view>
          <view>{{ result?.danger }}</view>
          <view>zhanwei</view>
        </view>
        <view class="list">
          <view class="list-item">
            <view class="title">特征一：</view>
            <view>{{ result?.env }}</view>
          </view>
          <view class="list-item">
            <view class="title">特征一：</view>
            <view> {{ result?.habits }}</view>
          </view>
          <view class="list-item">
            <view class="title">特征一：</view>
            <view> {{ result?.distribution }}</view>
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
