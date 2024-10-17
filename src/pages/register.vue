<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "nutui-uniapp/components/composables";

const toast = useToast();

const account = ref();

const password = ref();

const submit = () => {
  if (account.value && password.value) {
    uni.navigateTo({
      url: `/pages/index`,
    });
    uni.setStorageSync("userToken", "yourTokenHere");
  } else {
    toast.warning("请输入用户名和密码！");
  }
};
</script>

<template>
  <view class="content">
    <img src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg" />
    <view class="form">
      <view class="form-item">
        <view class="title">账号</view>
        <nut-input v-model="account" placeholder="请输入账号"></nut-input>
      </view>

      <view class="form-item">
        <view class="title">密码</view>
        <nut-input
          v-model="password"
          type="password"
          placeholder="请输入密码"
        ></nut-input>
      </view>

      <nut-button @click="submit">创建账号</nut-button>

      <nut-toast></nut-toast>
    </view>
  </view>
</template>

<style scoped lang="less">
.content {
  display: flex;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  image {
    width: 100%;
    height: 400rpx;
  }
  .form {
    margin-top: 100rpx;
    width: 550rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .form-item {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-bottom: 20rpx;
    }
  }
}
</style>
