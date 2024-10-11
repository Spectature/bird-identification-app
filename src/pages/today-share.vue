<script>
import MediaLoader from "../components/media-loader.vue";
import TabBar from "../components/tab-bar.vue";
import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    MediaLoader,
    TabBar,
  },

  data() {
    return {
      result: [
        {
          type: "video",
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          content: "0",
        },
        {
          type: "audio",
          src: "https://ting8.yymp3.com/new27/liyugang6/6.mp3",
          content: "1",
        },
        {
          type: "image",
          src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
          content: "2",
        },
        {
          type: "audio",
          src: "https://ting8.yymp3.com/new27/jinzhiwen3/1.mp3",
          content: "3",
        },
        {
          type: "image",
          src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
          content: "4",
        },
        {
          type: "video",
          src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
          content: "5",
        },
      ],
      stopStatus: false,
      currentIndex: 0,
      originIndex: 0,
    };
  },

  methods: {
    // 处理切换的函数
    dealChange(index) {
      this.originIndex = this.currentIndex;
      this.currentIndex = index;
      if (this.result[this.originIndex].type === "video") {
        console.log("emit stop");
        this.stopStatus = !this.stopStatus;
      }
    },

    // 停止事件
    // stop() {
    //   this.stopStatus = !this.stopStatus;
    // },

    generateShortUUID() {
      return uuidv4().split("-")[0]; // 取UUID的前一段
    },
  },

  mounted() {
    this.result.forEach((item) => {
      if (item.type === "video") {
        item.className = `iframe${this.generateShortUUID()}`;
      }
    });
  },
};
</script>

<template>
  <view class="container">
    <nut-swiper
      :loop="false"
      direction="vertical"
      :duration="500"
      style="height: 100%"
      @change="dealChange"
    >
      <nut-swiper-item v-for="(item, index) in result" :key="index">
        <view class="top">
          <view class="top">
            <media-loader
              ref="mediaRef"
              :type="item.type"
              :src="item.src"
              :video-class="item.className"
            ></media-loader>
          </view>
          <view class="content">
            {{ item.content }}
          </view>
        </view>
      </nut-swiper-item>
    </nut-swiper>

    <view
      :prop="stopStatus"
      :change:prop="
        renderScript.setStop(this.result[this.originIndex].className)
      "
    ></view>
    <view class="bottom"> <tab-bar :current-index="2"></tab-bar></view>
  </view>
</template>

<script module="renderScript" lang="renderjs">
export default {
  methods: {
    setStop(className) {
       console.log(className)
       const iframe = document.querySelector(`.${className}`);
       iframe?.contentWindow?.postMessage('stop','*');
      }
    }
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  .content {
    display: flex;
    justify-content: center;
  }
}
</style>
