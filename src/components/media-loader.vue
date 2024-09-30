<script setup lang="ts">
import AudioApp from "@/components/audio-app.vue";
import { computed, watch } from "@vue/runtime-core";

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

const innerSrc = ref();

console.log(props);
setTimeout(() => {
  // innerType.value = "image";
  // innerSrc.value = "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg";
}, 1000);
watch(
  () => props,
  (newProps, oldProps) => {
    console.log(props.type);
  },
  {
    immediate: true,
    deep: true,
  },
);

// const innerType = ref(props.type);

const innerType = computed(() => {
  console.log(props.type);
  return props.type;
});

// const innerSrc = computed(() => {
//   console.log(props.src);
//   return props.src;
// });
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

    <!--    <video-->
    <!--      v-else-if="innerType === 'video'"-->
    <!--      :src="innerSrc"-->
    <!--      controls-->
    <!--      class="media"-->
    <!--    ></video>-->

    <!--    <audio-app v-else-if="innerType === 'audio'" />-->
  </view>
</template>

<style scoped lang="less">
.media-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

//.media {
//  width: 100%;
//  height: auto;
//  max-width: 100%;
//  max-height: 300px;
//}
//
//.media-audio {
//  width: 100%;
//}
//
//.unsupported {
//  color: red;
//  font-size: 16px;
//}
</style>
