<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
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
  videoClass: {
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
const innerVideoClass = computed(() => {
  return props.videoClass;
});

const audioRef = ref();

const setStop = () => {
  audioRef.value?.setStop();
};

const previewImg = (url: string) => {
  uni.previewImage({
    current: url, // 当前显示的图片链接
    urls: [url], // 只预览这一张图片
  });
};

function generateShortUUID() {
  return uuidv4().split("-")[0]; // 取UUID的前一段
}

const className = ref(generateShortUUID());
const observerElement = ref();

onMounted(() => {
  // 2. 创建 IntersectionObserver 实例
  const observer = uni.createIntersectionObserver(this, {
    thresholds: [0.1], // 设置可见性阈值,
  });

  // 开始观察自身元素
  observer.observe(`.media-container${className.value}`, (res) => {
    // console.log("进入或离开可视区域:", res.intersectionRatio);
    if (res.intersectionRatio > 0.1) {
      // console.log("元素在可视区域内");
      // console.log(className.value);
    } else {
      // console.log("元素离开了可视区域");
      setStop();
      // console.log(className.value);
    }
  });

  // onUnmounted(() => {
  //   // 销毁观察器
  //   observer.disconnect();
  // });
});
</script>

<template>
  <view
    ref="observerElement"
    :class="['media-container', `media-container${className}`]"
  >
    <view class="top">
      {{ className }}
      <view v-if="innerType === 'image'">
        <image
          :src="innerSrc"
          mode="aspectFit"
          class="media"
          @click="previewImg(innerSrc)"
        >
        </image>
      </view>

      <video-app
        v-else-if="innerType === 'video'"
        :src="innerSrc"
        :video-class="innerVideoClass"
      ></video-app>

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
