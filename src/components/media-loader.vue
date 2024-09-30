<script setup lang="ts">
import AudioApp from "@/components/audio-app.vue";

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

const innerType = ref(props.type);
const innerSrc = ref(props.src);

watchEffect(() => {
  innerType.value = props.type;
  innerSrc.value = props.src;
});
</script>

<template>
  <view class="media-container">
    <!--    &lt;!&ndash; 判断资源类型 &ndash;&gt;-->
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

    <!--    <audio-app v-else-if="innerType === 'audio'" />-->
  </view>
</template>

<style scoped lang="less">
.media-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
