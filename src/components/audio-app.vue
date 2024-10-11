<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
import { createInnerAudioContext } from "@/uni_modules/lime-audio-player";
import { onPageHide } from "@dcloudio/uni-app";

type Song = {
  id: number;
  src: string;
  name: string;
};

type ApiResponse = {
  code: number;
  now: string;
  text: string;
  type: string;
  song_url: string;
};

const ctx = createInnerAudioContext();

const isPlay = ref(false);
const duration = ref(1000);
const progress = ref(0);

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
});

watch(
  () => props.src,
  () => {
    if (props.src) {
      ctx.src = props.src;
    }
  },
  {
    immediate: true,
  },
);

const volume = ref(ctx.volume);

const song = reactive<Song>({
  id: 0,
  src: "",
  name: "",
} as Song);

let timeStr = computed((): string => {
  const seconds = Math.floor(progress.value / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
});

const songList: Song[] = [
  {
    id: 1404596131,
    src: "",
    name: "see you again",
  },
  {
    id: 401723106,
    src: "",
    name: "Walking In the Sun",
  },
  {
    id: 1339030970,
    src: "",
    name: "直到世界尽头",
  },
];

let index = 0;
const loadData = () => {
  // console.log("loadData::");
  // ctx.updateSrc('/static/mp3/721509693.aac')
  // ctx.src= '/static/mp3/721509693.aac'
  // ctx.src= 'http://m10.music.126.net/20240709022335/913dd4e55ea2c00925e709bde1ae6cf8/ymusic/c68e/7867/b3e7/822bc52e08c1e166779779044868c616.mp3'

  // index++;
  // const key = index % songList.length;
  // const item = songList[key];

  return;
};

const bindAudioEventHandlers = () => {
  ctx.onError((res: any) => {
    console.log("onError", res);
    // uni.showToast({
    //   title: res.errMsg,
    //   icon: "error",
    // });
    // nextSong()
  });

  ctx.onSeeked((res: any) => {
    console.log("onSeeked", res);
  });
  ctx.onTimeUpdate((_: any) => {
    progress.value = ctx.currentTime * 1000;
  });
  ctx.onCanplay((_: any) => {
    duration.value = ctx.duration * 1000;
  });

  ctx.onEnded((res: any) => {
    console.log("res", res.errMsg);
    // nextSong();
  });
};
const unbindAudioEventHandlers = () => {
  ctx.offEnded();
  ctx.offPause();
  ctx.offPlay();
  ctx.offSeeked();
  ctx.offTimeUpdate();
  ctx.offCanplay();
  ctx.offEnded();
  ctx.destroy();
};

const togglePlay = () => {
  isPlay.value = !isPlay.value;
  if (isPlay.value) {
    ctx.play();
  } else {
    ctx.pause();
  }
};

const handleSeek = (e: any) => {
  // console.log("跳到", e.detail.value);
  ctx.seek(e.detail.value / 1000);
};

const setStop = () => {
  if (isPlay.value) {
    console.log("audio stop", ctx.src);
    ctx.pause();
    ctx.seek(0);
    progress.value = 0;
    isPlay.value = false;
  }
};

defineExpose({
  setStop,
});

onMounted(() => {
  // ctx.volume = volume.value / 100;

  bindAudioEventHandlers();
  loadData();
});

onPageHide(() => {
  unbindAudioEventHandlers();
});
</script>

<template>
  <view class="audio">
    <view class="top">
      <view class="audio__player-play-cont">
        <view class="audio__player-play" @click="togglePlay">
          <image src="/static/logo.png" :class="`${isPlay ? 'rotate' : ''}`" />
          <view class="audio__player-play-icon">
            <image :src="isPlay ? '/static/pause.png' : '/static/play.png'" />
          </view>
        </view>
      </view>
    </view>
    <view class="title"></view>
    <!--    <view class="audio__player-progress-container">-->
    <!--      <view-->
    <!--        ref="audioProgressWrap"-->
    <!--        class="audio__player-progress-wrap"-->
    <!--        @click.stop="handleClickProgressWrap"-->
    <!--      >-->
    <!--        <view-->
    <!--          ref="audioProgress"-->
    <!--          class="audio__player-progress"-->
    <!--          :style="{-->
    <!--            backgroundColor: option_.progressBarColor,-->
    <!--          }"-->
    <!--        />-->
    <!--        <view-->
    <!--          ref="audioProgressPoint"-->
    <!--          class="audio__player-progress-point"-->
    <!--          :style="{-->
    <!--            backgroundColor: option_.indicatorColor,-->
    <!--            boxShadow: `0 0 10px 0 ${option_.indicatorColor}`,-->
    <!--          }"-->
    <!--          @panstart="handleProgressPanStart"-->
    <!--          @panend="handleProgressPanEnd"-->
    <!--          @panmove="handleProgressPanMove"-->
    <!--        />-->
    <!--      </view>-->
    <!--      <view class="audio__player-time">-->
    <!--        <span>{{ `${formatSecond(currentTime)} / ${totalTimeStr}` }}</span>-->
    <!--      </view>-->
    <!--    </view>-->
  </view>

  <!--  <view class="audio-player">-->
  <text class="song-title">{{ song.name }}</text>
  <!--  <view class="audio-controls">-->
  <!--    <text class="current-time">{{ timeStr }}</text>-->
  <slider
    class="process"
    :value="progress"
    :min="0"
    :max="duration"
    :step="1"
    @change="handleSeek"
  ></slider>
  <!--  </view>-->

  <!--    <button type="button" @click="togglePlay">-->
  <!--      {{ isPlay ? "暂停" : "播放" }}-->
  <!--    </button>-->
  <!--    &lt;!&ndash;    <button type="button" @click="nextSong">下一曲</button>&ndash;&gt;-->
  <!--    <button type="button" @click="stopAudio">停止</button>-->
  <!--    <button type="button" @click="setSpeed(1)">1倍速</button>-->
  <!--    <button type="button" @click="setSpeed(1.5)">1.5倍速</button>-->
  <!--    <button type="button" @click="setSpeed(2)">2倍速</button>-->
  <!--    <view class="volume-controls">-->
  <!--      <text>音量{{ volume }}</text>-->
  <!--      <slider-->
  <!--        :value="volume"-->
  <!--        :min="0"-->
  <!--        :max="100"-->
  <!--        :step="1"-->
  <!--        @change="changeVolume"-->
  <!--      ></slider>-->
  <!--    </view>-->
  <!--  </view>-->
</template>

<style scoped lang="less">
.audio-player {
  flex: 1;
  padding: 20px;
  background: linear-gradient(
      180deg,
      rgba(33, 70, 255, 0.5) 0%,
      rgba(255, 255, 255, 1) 100%
    ),
    rgba(255, 255, 255, 1);
}
.song-title {
  font-size: 20px;
  text-align: center;
  width: 100%;
}
.audio-controls {
  margin-top: 20px;
  background-color: #242424;
  border-radius: 9px;
  padding: 12px;
  margin-bottom: 20px;
}
.current-time {
  padding-bottom: 5px;
  color: white;
}
.volume-controls {
  padding-top: 10px;
}

.audio {
  display: flex;
  justify-content: center;
  padding: 20rpx 50rpx;
  align-items: center;
  .audio__player-play {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .audio__player-play:active,
  .audio__player-play image:active {
    opacity: 0.75;
  }
  .audio__player-play image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 50%;
  }
  .audio__player-play-icon {
    position: absolute;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    padding: 0.5rem 0.5rem;
    opacity: 0.8;
  }
  .audio__player-play-icon image {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
}

@keyframes audio__player-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.rotate {
  animation: audio__player-spin 5s linear infinite;
}

.process {
  & :deep(.uni-slider-handle-wrapper) {
    width: 500rpx;
    height: 3px;
  }
  & :deep(.uni-slider-thumb) {
    width: 30rpx !important;
    height: 30rpx !important;
    margin-left: -3% !important;
    margin-top: -3% !important;
    background-color: #3b91f4 !important;
    box-shadow: 0 0 10px 0 #3b91f4;
  }
  & :deep(.uni-slider-thumb:after) {
    content: "";
    position: absolute;
    top: 27%;
    left: 26.5%;
    width: 15rpx;
    height: 15rpx;
    background: #fff;
    border-radius: 50%;
  }
}
</style>
