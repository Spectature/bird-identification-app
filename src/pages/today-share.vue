<script setup lang="ts">
import { ref } from "vue";
import MediaLoader from "../components/media-loader.vue";
import TabBar from "../components/tab-bar.vue";

const result = ref([
  {
    type: "video",
    src: "http://vjs.zencdn.net/v/oceans.mp4",
    content: "0",
  },
  {
    type: "audio",
    src: "https://ting8.yymp3.com/new27/liyugang6/6.mp3",
    content: "1",
  },
  {
    type: "image",
    src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    content: "2",
  },
  {
    type: "audio",
    src: "https://ting8.yymp3.com/new27/jinzhiwen3/1.mp3",
    content: "3",
  },
  {
    type: "image",
    src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    content: "4",
  },
  {
    type: "video",
    src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    content: "5",
  },
]);

// const mediaRef = ref();

const dealChange = (index: number) => {
  // console.log(mediaRef.value);
  // mediaRef.value[index].setAudioStop();
  console.log(222);
  setTimeout(() => {
    uni.pageScrollTo({
      scrollTop: 3, // 向上滑动到指定的100像素处
      duration: 0, // 滑动动画的持续时间，单位是毫秒
      success: () => {
        console.log("success");
      },
    });
  }, 1000);
};

// const currentIndex = ref(0);
// const startY = ref(0);
//
// const startTouch = (event) => {
//   startY.value = event.touches[0].clientY; // 记录起始位置
// };
//
// const moveTouch = (event) => {
//   const moveY = event.touches[0].clientY; // 获取当前滑动位置
//   const distance = startY.value - moveY; // 计算滑动距离
//
//   // 在滑动距离较大时，判断是否进行切换
//   if (distance > 50 && currentIndex.value < result.value.length - 1) {
//     currentIndex.value += 1; // 向下切换
//     startY.value = moveY; // 更新起始位置
//   } else if (distance < -50 && currentIndex.value > 0) {
//     currentIndex.value -= 1; // 向上切换
//     startY.value = moveY; // 更新起始位置
//   }
// };

const endTouch = () => {
  // 可以在此处执行其他结束逻辑，例如重置某些状态
};
</script>

<template>
  <view class="container">
    <nut-swiper
      :loop="false"
      direction="vertical"
      :duration="500"
      style="height: 100%"
      @change="dealChange"
    >
      <nut-swiper-item v-for="(item, index) in result" :key="index">
        <!--    <view-->
        <!--      class="swiper-container"-->
        <!--      @touchstart="startTouch"-->
        <!--      @touchmove="moveTouch"-->
        <!--      @touchend="endTouch"-->
        <!--    >-->
        <!--      <view-->
        <!--        class="swiper-wrapper"-->
        <!--        :style="{ transform: `translateY(-${currentIndex * 10}%)` }"-->
        <!--      >-->
        <!--        <view class="swiper-slide" v-for="(item, index) in result" :key="index">-->
        <!--   -->
        <!--        </view>-->
        <!--      </view>-->
        <!--    </view>-->

        <view class="top">
          <view class="top">
            <media-loader
              ref="mediaRef"
              :type="item.type"
              :src="item.src"
            ></media-loader>
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
  position: relative;
  .content {
    display: flex;
    justify-content: center;
  }
  .bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: lightcoral;
    z-index: 10; /* 层级较高，显示在上面 */
  }
}

//.swiper-container {
//  height: 100vh; /* 设置容器高度 */
//  overflow: hidden; /* 隐藏溢出部分 */
//  position: relative;
//}
//
//.swiper-wrapper {
//  transition: transform 0.3s ease; /* 设置过渡效果 */
//  display: flex;
//  flex-direction: column; /* 垂直排列 */
//}
//
//.swiper-slide {
//  height: 100vh; /* 每个页面占满屏幕 */
//  display: flex;
//  justify-content: center;
//  align-items: center;
//  font-size: 24px;
//  background-color: #f0f0f0; /* 背景色 */
//  border-bottom: 1px solid #ccc; /* 分隔线 */
//}
</style>
