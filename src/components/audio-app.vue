<script setup lang="ts">
import { createInnerAudioContext } from "@/uni_modules/lime-audio-player";

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
const volume = ref(ctx.volume);
const isPlay = ref(true);
const duration = ref(1000);
const progress = ref(0);

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
  console.log("loadData::");
  // ctx.updateSrc('/static/mp3/721509693.aac')
  // ctx.src= '/static/mp3/721509693.aac'
  // ctx.src= 'http://m10.music.126.net/20240709022335/913dd4e55ea2c00925e709bde1ae6cf8/ymusic/c68e/7867/b3e7/822bc52e08c1e166779779044868c616.mp3'

  index++;
  const key = index % songList.length;
  const item = songList[key];
  ctx.src = "https://web-ext-storage.dcloud.net.cn/uni-app/ForElise.mp3";
  return;
  if (songList[key].src !== "") {
    song.id = item.id;
    song.src = item.src;
    song.name = item.name;
    ctx.src = song.src;
    return;
  }
  // https://dataiqs.com/api/docs/?id=2
  uni.request({
    //https://web-ext-storage.dcloud.net.cn/uni-app/ForElise.mp3
    url: "https://dataiqs.com/api/netease/music/",
    timeout: 5000,
    data: {
      // type: 'random',
      type: "songid",
      id: item.id,
    },
    //:RequestSuccess<UTSJSONObject>
    success(res) {
      console.log("成功", res);
      const data = JSON.parse<ApiResponse>(JSON.stringify(res["data"]));
      if (data != null && data.code == 200) {
        ctx.src = data.song_url;
        song.id = item.id;
        song.name = item.name;
        song.src = data.song_url;
        songList[key].src = data.song_url;
      }
    },
    fail(err) {
      console.log("err", err);
      uni.showToast({
        title: "请求失败",
        icon: "error",
      });
    },
  });
};
const nextSong = () => {
  loadData();
};

const bindAudioEventHandlers = () => {
  console.log("bindAudioEventHandlers");
  ctx.onError((res) => {
    console.log("onError", res.errMsg);
    uni.showToast({
      title: res.errMsg,
      icon: "error",
    });
    // nextSong()
  });
  ctx.onPause((res) => {
    console.log("onPause", res.errMsg);
  });
  ctx.onPlay((res) => {
    console.log("onPlay", res.errMsg);
  });
  ctx.onSeeked((res) => {
    console.log("onSeeked", res.errMsg);
  });
  ctx.onTimeUpdate((_) => {
    progress.value = ctx.currentTime * 1000;
  });
  ctx.onCanplay((_) => {
    duration.value = ctx.duration * 1000;
  });

  ctx.onEnded((res) => {
    console.log("res", res.errMsg);
    nextSong();
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
const changeVolume = (e: UniSliderChangeEvent) => {
  console.log("音量", e.detail.value);
  ctx.volume = e.detail.value / 100;
  volume.value = e.detail.value;
};
const togglePlay = () => {
  isPlay.value = !isPlay.value;
  if (isPlay.value) {
    ctx.play();
  } else {
    ctx.pause();
  }
};
const stopAudio = () => {
  ctx.stop();
};
const handleSeek = (e: UniSliderChangeEvent) => {
  console.log("跳到", e.detail.value);
  // ctx.seek(e.detail.value/1000);
};
const setSpeed = (speed: number) => {
  ctx.playbackRate = speed;
};

onMounted(() => {
  ctx.autoplay = true;
  // ctx.volume = volume.value / 100;
  bindAudioEventHandlers();
  loadData();
});

onUnmounted(() => {
  unbindAudioEventHandlers();
});
</script>

<template>
  <view class="audio-player">
    <text class="song-title">{{ song.name }}</text>
    <view class="audio-controls">
      <text class="current-time">{{ timeStr }}</text>
      <slider
        :value="progress"
        :min="0"
        :max="duration"
        :step="1"
        @change="handleSeek"
      ></slider>
    </view>

    <button type="button" @click="togglePlay">
      {{ isPlay ? "暂停" : "播放" }}
    </button>
    <button type="button" @click="nextSong">下一曲</button>
    <button type="button" @click="stopAudio">停止</button>
    <button type="button" @click="setSpeed(1)">1倍速</button>
    <button type="button" @click="setSpeed(1.5)">1.5倍速</button>
    <button type="button" @click="setSpeed(2)">2倍速</button>
    <view class="volume-controls">
      <text>音量{{ volume }}</text>
      <slider
        :value="volume"
        :min="0"
        :max="100"
        :step="1"
        @change="changeVolume"
      ></slider>
    </view>
  </view>
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
</style>
