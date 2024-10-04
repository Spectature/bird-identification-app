<script setup lang="ts">
import { computed, ref } from "vue";
import AudioApp from "../components/audio-app.vue";

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

// const showPreview = ref(false);
const previewImg = (url: string) => {
  uni.previewImage({
    current: url, // 当前显示的图片链接
    urls: [url], // 只预览这一张图片
  });
};
</script>

<template>
  <view class="media-container">
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

      <video
        v-else-if="innerType === 'video'"
        :src="innerSrc"
        controls
        class="media"
      ></video>

      <audio-app v-else-if="innerType === 'audio'" :src="innerSrc" />
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
}
</style>
