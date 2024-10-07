<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const onloadCode = ref();

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
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
        #poster {
          display: none;
        }
      </style>
    </head>
    <body style="margin: 0">
      <video id="video" class="media" controls></video>
      <img id="poster" class="media" />
      <script>
        const video = document.getElementById('video');
        const poster = document.getElementById('poster');

        video.src = '${props.src}';
        video.currentTime = 0.1;
        // video.addEventListener('loadeddata', function() {
        //   const canvas = document.createElement('canvas');
        //   canvas.width = video.videoWidth;
        //   canvas.height = video.videoHeight;
        //   const context = canvas.getContext('2d');
        //   context.drawImage(video, 0, 0, canvas.width, canvas.height);
        //   poster.src = canvas.toDataURL('image/jpeg');
        //   poster.style.display = 'block';
        //   video.style.display = 'block';
        // });
      <\/script>
    </body>
    </html>
    `;
});
</script>

<template>
  <iframe
    class="iframe"
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
</style>
