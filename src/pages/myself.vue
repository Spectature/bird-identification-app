<script setup lang="ts">
import { ref, onMounted } from "vue";
import TabBar from "../components/tab-bar.vue";

const res = ref();

const init = async () => {
  // res.value = await useGet("/cc", { id });
  res.value = {
    id: "1",
    name: "啊实打",
    sex: "男",
    region: "东北",
    phone: "1333333333",
    email: "222@22.com",
  };
};

const sheetVisible = ref(false);
const menuItems = [
  {
    name: "从相册选择",
  },
  {
    name: "拍照",
  },
];

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
          // uni.navigateTo({
          //   url: "/pages/result",
          // });
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

const jumpPage = (id: string) => {
  uni.navigateTo({
    url: `/pages/my-bird?id=${id}`,
  });
};

onMounted(() => {
  init();
});
</script>

<template>
  <view class="container">
    <view class="top">
      <view class="head">
        <nut-avatar size="large" @click="sheetVisible = true">
          <image
            src="https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png"
          />
        </nut-avatar>
        <view class="name">{{ res?.name }}</view>
        <view class="edit">编辑</view>
      </view>
      <view class="content">
        <view class="info">
          <view class="info-item">
            <view class="title">性别</view>
            <view>{{ res?.sex }}</view>
          </view>
          <view class="info-item">
            <view class="title">地域</view>
            <view>{{ res?.region }}</view>
          </view>
          <view class="info-item">
            <view class="title">手机号</view>
            <view>{{ res?.phone }}</view>
          </view>
          <view class="info-item">
            <view class="title">邮箱</view>
            <view>{{ res?.email }}</view>
          </view>
        </view>
        <view class="history" @click="jumpPage(res.id)">
          <view class="title">我的识鸟</view>
        </view>
      </view>
    </view>

    <view class="bottom">
      <tab-bar :current-index="4"></tab-bar>
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
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  .top {
    padding: 0 40rpx;
    .head {
      margin-top: 80rpx;
      display: flex;
      align-items: center;
      .name {
        margin-left: 40rpx;
      }
      .edit {
        margin-left: auto;
      }
    }
    .content {
      margin-top: 30rpx;
      .info {
        .info-item {
          margin-bottom: 30rpx;
          .title {
            margin-bottom: 15rpx;
          }
        }
      }
      .history {
      }
    }
  }
}
</style>
