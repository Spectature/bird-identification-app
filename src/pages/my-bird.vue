<script setup lang="ts">
const searchValue = ref();

const res = ref();

setTimeout(() => {
  res.value = [
    {
      id: "1",
      name: "1",
      img: "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png",
    },
    {
      id: "1",
      name: "2",
      img: "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png",
    },
    {
      id: "1",
      name: "3",
      img: "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png",
    },
  ];
});

const jumpPage = (id: string) => {
  uni.navigateTo({
    url: `/pages/explore-bird-nest?id=${id}`,
  });
};
</script>

<template>
  <view class="container">
    <view class="top"> 识别记录 </view>
    <view class="list">
      <view
        v-for="(item, index) in res"
        class="list-item"
        :key="index"
        @click="jumpPage(item.id)"
      >
        <img :src="item.img" alt="" />
        <view class="name">{{ item.name }}</view>
      </view>
      <nut-empty description="无数据"></nut-empty>
    </view>
  </view>
</template>

<style scoped lang="less">
.top {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
}
.list {
  padding: 0 16px;
  .list-item {
    display: flex;
    align-items: center;
    margin: 30rpx 0;
    img {
    }
    .name {
      margin-left: 20rpx;
    }
  }
}
</style>
