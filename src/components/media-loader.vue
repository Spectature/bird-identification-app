<script setup lang="ts">
import { computed, onUnmounted, ref, onMounted, nextTick } from "vue";
import AudioApp from "../components/audio-app.vue";
import { v4 as uuidv4 } from "uuid";
import VideoApp from "@/components/video-app.vue";

const props = defineProps({
  type: {
    type: String,
    default: "", // 默认加载图片
  },
  src: {
    type: String,
    default: "",
  },
});

const innerType = computed(() => {
  return props.type;
});
const innerSrc = computed(() => {
  return props.src;
});

const audioRef = ref();
const setAudioStop = () => {
  audioRef.value?.setStop();
};

const previewImg = (url: string) => {
  uni.previewImage({
    current: url, // 当前显示的图片链接
    urls: [url], // 只预览这一张图片
  });
};

// const observerElement = ref(null);
// const isVisible = ref(false);
// const observerCallback = (entries: any) => {
//   entries.forEach((entry: any) => {
//     if (entry.isIntersecting) {
//       isVisible.value = true;
//       console.log("组件进入可视区");
//     } else {
//       isVisible.value = false;
//       setAudioStop();
//       console.log("组件离开可视区");
//     }
//   });
// };
//
const className = ref();
// let observer: any;
// let obElement: any;

// onMounted(async () => {
//   className.value = `media-${uuidv4()}`;
//   observer = new IntersectionObserver(observerCallback, {
//     root: null, // 默认是浏览器视口
//     threshold: 0.1, // 当有 10% 进入视口时触发
//   });
//
//   await nextTick();
//   obElement = uni.getElementById(className.value);
//   if (obElement) {
//     observer.observe(obElement);
//   }
// });
//
// onUnmounted(() => {
//   if (obElement) {
//     observer.unobserve(obElement);
//   }
// });
</script>

<template>
  <view ref="observerElement" :id="className" class="media-container">
    <view class="top">
      <view v-if="innerType === 'image'">
        <image
          :src="innerSrc"
          mode="aspectFit"
          class="media"
          @click="previewImg(innerSrc)"
        >
        </image>
      </view>

      <video-app v-else-if="innerType === 'video'" :src="innerSrc"></video-app>
      <!--      <video-->
      <!--        v-else-if="innerType === 'video'"-->
      <!--        :src="innerSrc"-->
      <!--        class="media"-->
      <!--      ></video>-->

      <audio-app
        ref="audioRef"
        v-else-if="innerType === 'audio'"
        :src="innerSrc"
      />
    </view>

    <view class="bottom">
      <view class="res"></view>
    </view>
  </view>
</template>

<style scoped lang="less">
.media-container {
  display: flex;
  justify-content: center;
  align-items: center;
  .media {
    margin-top: 500rpx;
  }
}
</style>
