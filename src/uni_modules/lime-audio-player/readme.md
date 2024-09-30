# lime-audio-player
- 参考小程序createInnerAudioContext实现的音频播放管理API


## 安装
插件市场导入即可

## 使用
使用方法跟小程序的一模一样
```js
import { createInnerAudioContext } from '@/uni_modules/lime-audio-player';
const ctx = createInnerAudioContext()
ctx.src = 'xxxx.mp3'
ctx.play()
```
### demo
```
代码位于 uni_modules/lime-audio-player/components/lime-audio-player/lime-audio-player.uvue
<lime-audio-player/>
```


## API
因为直接参照小程序`createInnerAudioContext`API，所以可以直接按[createInnerAudioContext](https://uniapp.dcloud.net.cn/api/media/audio-context.html)文档


## 打赏

如果你觉得本插件，解决了你的问题，赠人玫瑰，手留余香。  
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png)
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png)