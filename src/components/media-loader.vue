<script setup lang="ts">
import { computed } from "vue";
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
</script>

<template>
  <view class="media-container">
    <view class="top">
      <image
        v-if="innerType === 'image'"
        :src="innerSrc"
        mode="aspectFit"
        class="media"
      ></image>

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
