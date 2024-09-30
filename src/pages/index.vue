<template>
  <view class="content">
    <view class="container">
      <view class="top">
        <nut-swiper
          :init-page="0"
          :pagination-visible="true"
          pagination-color="#426543"
          auto-play="3000"
        >
          <nut-swiper-item v-for="item in swiperList" :key="item">
            <img :src="item" alt="" />
          </nut-swiper-item>
        </nut-swiper>
      </view>
      <view class="middle">
        <view class="left">
          <img
            src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
            alt=""
          />
        </view>
        <view class="right">
          <img
            src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
            alt=""
          />
          <img
            src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
            alt=""
          />
        </view>
      </view>
      <view class="bottom">
        <text> 地区常见鸟 </text>
        <nut-swiper
          :loop="false"
          :init-page="0"
          :pagination-visible="false"
          width="200"
        >
          <nut-swiper-item v-for="item in commonBirdList" :key="item">
            <img :src="item" alt="" />
          </nut-swiper-item>
        </nut-swiper>
      </view>
    </view>
    <view class="bottom">
      <tab-bar :current-index="0"></tab-bar>
    </view>
  </view>
</template>

<script setup lang="ts">
import TabBar from "@/components/tab-bar.vue";

const swiperList = ref<string[]>([]);

const commonBirdList = ref();

onMounted(() => {
  swiperList.value = [
    "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    "https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg",
    "https://storage.360buyimg.com/jdc-article/welcomenutui.jpg",
    "https://storage.360buyimg.com/jdc-article/fristfabu.jpg",
  ];

  commonBirdList.value = [
    "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    "https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg",
    "https://storage.360buyimg.com/jdc-article/welcomenutui.jpg",
    "https://storage.360buyimg.com/jdc-article/fristfabu.jpg",
  ];
});
</script>

<style scoped lang="less">
.content {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  .container {
    .middle {
      display: flex;
      .left {
        width: 50%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        width: 50%;
        img {
          width: 100%;
        }
      }
    }
    .bottom {
      &:deep(.nut-swiper-item) {
        //width: 40vw;
        img {
          width: 90%;
          height: 100%;
        }
      }
    }
  }
}
.nut-swiper-item {
  line-height: 250rpx;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
