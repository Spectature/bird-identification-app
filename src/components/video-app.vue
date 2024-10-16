<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  videoClass: {
    type: String,
    default: "",
  },
});
const innerVideoClass = computed(() => {
  return props.videoClass;
});

const iframeContent = computed(() => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .media {
          width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body style="margin: 0">
      <video id="video" class="media" controls controlslist="nodownload noplaybackrate"></video>
      <script>
        const video = document.getElementById('video');

        video.src = '${props.src}';
        video.currentTime = 0.1;

         window.addEventListener("message", (event) => {
           if(event.data === 'stop'){
              video.pause()
              video.currentTime = 0;
           }
        });

      <\/script>
    </body>
    </html>
    `;
});
</script>

<template>
  <iframe
    :class="['iframe', innerVideoClass]"
    :srcdoc="iframeContent"
    style="height: 100%; width: 100%"
  ></iframe>
</template>

<style scoped lang="less">
.iframe {
  border: 0;
  margin-top: 200rpx;
}
body {
  margin: 0;
}

#video::-webkit-media-controls-enclosure {
  display: none;
}
video::-webkit-media-controls {
  display: none !important;
}
</style>
