<script setup lang="ts">
import MediaLoader from "@/components/media-loader.vue";

const isLoading = ref(false);

const type = ref("");
const src = ref("");

const handleReceiveData = (data: any) => {
  const convertRes = JSON.parse(data);
  // 在这里处理接收到的数据
  type.value = convertRes.type;
  src.value = convertRes.url;
};

// WebSocket 连接地址
const wsUrl = "ws://localhost:5000";

// WebSocket 实例
let ws: WebSocket;

const connectWebSocket = () => {
  ws = new WebSocket(wsUrl);

  // 监听连接打开
  ws.onopen = () => {
    console.log("WebSocket 连接成功");
  };

  // 监听消息
  ws.onmessage = (event) => {
    handleReceiveData(event.data);
  };

  // 监听错误
  ws.onerror = (error) => {
    console.error("WebSocket 错误:", error);
  };

  // 监听关闭
  ws.onclose = () => {
    console.log("WebSocket 连接关闭");
  };
};

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  if (ws) {
    ws.close();
  }
});
</script>

<template>
  <view class="content">
    <view v-if="isLoading" class="loading">
      <nut-icon name="loading"></nut-icon>
      <view>识别中，请稍等....</view>
    </view>
    <view v-else>
      <view class="top">
        <media-loader :type="type" :src="src"></media-loader>
      </view>
      <view class="bottom"></view>
    </view>
  </view>
</template>

<style scoped lang="less">
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  .loading {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 150rpx;
  }
}
</style>
