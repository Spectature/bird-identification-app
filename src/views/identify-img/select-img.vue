<template>
  <nut-button @click="openCamera">打开相机</nut-button>
  <nut-button @click="openAlbum">打开照片库</nut-button>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import router from '../../router';
const openCamera = () => {
  Taro.chooseImage({
    count: 1, // 默认选择1张
    sourceType: ['camera'], // 只允许使用相机
    success: (res) => {
      const tempFilePaths = res.tempFilePaths;
      console.log(tempFilePaths); // 返回选择的图片临时路径
      // 可以在这里处理图片，例如显示或上传
    },
    fail: (err) => {
      console.error(err);
    },
  });
};

const openAlbum = () => {
  Taro.chooseImage({
    count: 1, // 默认选择1张
    sourceType: ['album'], // 只允许使用相册
    success: (res) => {
      const tempFilePaths = res.tempFilePaths[0];

      router.push(`/res/${encodeURIComponent(tempFilePaths)}`);
      console.log(`/res/${encodeURIComponent(tempFilePaths)}`);
      console.log(tempFilePaths); // 返回选择的图片临时路径
      // 在这里处理选择的图片，例如显示或上传
    },
    fail: (err) => {
      console.error(err);
    },
  });
};
</script>

<style lang="less" scoped></style>
