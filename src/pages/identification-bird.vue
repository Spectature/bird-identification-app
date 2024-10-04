<script setup lang="ts">
import { ref } from "vue";
import TabBar from "../components/tab-bar.vue";
const sheetVisible = ref(false);
const menuItems = [
  {
    name: "从相册选择",
  },
  {
    name: "拍照",
  },
  {
    name: "从文件管理选择",
  },
];

const uploadImg = (filePath: string) => {
  uni.uploadFile({
    url: "https://your-server.com/upload", // 后端服务器接口地址
    filePath: filePath, // 选择的文件路径
    name: "file", // 后端接收文件的字段名
    // formData: {
    //   user: "test", // 如果需要传递其他数据，可以通过 formData 传递
    // },
    success: (uploadFileRes) => {
      console.log("上传成功: ", uploadFileRes);
      if (uploadFileRes.statusCode === 200) {
        const data = JSON.parse(uploadFileRes.data); // 返回的后端响应
        console.log("后端返回的结果：", data);
      } else {
        console.error("上传失败，状态码：", uploadFileRes.statusCode);
      }
    },
    fail: (err) => {
      console.error("上传失败: ", err);
    },
  });
};

const chooseItem = (itemParams: any) => {
  switch (itemParams.name) {
    case "从相册选择":
      uni.chooseImage({
        count: 1, // 默认9，选择图片的数量
        sizeType: ["original"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], // 从相册选择
        success: function (res) {
          const tempFilePaths = res.tempFilePaths; // 返回的文件路径列表
          console.log(tempFilePaths);
          uni.navigateTo({
            url: "/pages/result",
          });
        },
      });
      break;
    case "拍照":
      uni.chooseImage({
        count: 1, // 可以选择图片的数量
        sourceType: ["camera"], // 仅使用摄像头
        success: function (res) {
          const tempFilePaths = res.tempFilePaths; // 临时文件路径
          console.log(tempFilePaths);
          // 这里可以将图片上传到服务器
        },
      });
      break;
    case "从文件管理选择":
      break;
  }
};
</script>

<template>
  <view class="content">
    <view class="container">
      <view class="top"> </view>
      <view class="middle">
        <nut-button type="primary" @click="sheetVisible = true"
          >智能识鸟</nut-button
        >
      </view>
      <view class="bottom"> </view>
    </view>
    <view class="bottom">
      <tab-bar :current-index="1"></tab-bar>
    </view>
    <nut-action-sheet
      :visible="sheetVisible"
      :menu-items="menuItems"
      cancel-txt="取消"
      :close-abled="true"
      @choose="chooseItem"
      @close="sheetVisible = false"
      @cancel="sheetVisible = false"
    >
    </nut-action-sheet>
  </view>
</template>

<style scoped lang="less">
.content {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
}
</style>
