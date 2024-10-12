@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER")
package uts.sdk.modules.limeAudioPlayer;
import android.content.Context;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.PlaybackParams;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.os.Build;
import io.dcloud.uniapp.*;
import io.dcloud.uniapp.extapi.*;
import io.dcloud.uts.*;
import io.dcloud.uts.Map;
import io.dcloud.uts.Set;
import io.dcloud.uts.UTSAndroid;
import kotlinx.coroutines.CoroutineScope;
import kotlinx.coroutines.Deferred;
import kotlinx.coroutines.Dispatchers;
import kotlinx.coroutines.async;
interface GeneralCallbackResult {
    var errMsg: String
}
typealias ErrorCode = Number;
interface InnerAudioContextOnErrorListenerResult {
    var errCode: Number
    var errMsg: String
}
typealias OffCanplayCallback = (res: GeneralCallbackResult) -> Unit;
typealias OffEndedCallback = (res: GeneralCallbackResult) -> Unit;
typealias InnerAudioContextOffErrorCallback = (result: InnerAudioContextOnErrorListenerResult) -> Unit;
typealias OffPauseCallback = (res: GeneralCallbackResult) -> Unit;
typealias OffPlayCallback = (res: GeneralCallbackResult) -> Unit;
typealias OffSeekedCallback = (res: GeneralCallbackResult) -> Unit;
typealias OffSeekingCallback = (res: GeneralCallbackResult) -> Unit;
typealias OffStopCallback = (res: GeneralCallbackResult) -> Unit;
typealias OffTimeUpdateCallback = (res: GeneralCallbackResult) -> Unit;
typealias OffWaitingCallback = (res: GeneralCallbackResult) -> Unit;
typealias OnCanplayCallback = (res: GeneralCallbackResult) -> Unit;
typealias OnEndedCallback = (res: GeneralCallbackResult) -> Unit;
typealias InnerAudioContextOnErrorCallback = (result: InnerAudioContextOnErrorListenerResult) -> Unit;
typealias OnPauseCallback = (res: GeneralCallbackResult) -> Unit;
typealias OnPlayCallback = (res: GeneralCallbackResult) -> Unit;
typealias OnSeekedCallback = (res: GeneralCallbackResult) -> Unit;
typealias OnSeekingCallback = (res: GeneralCallbackResult) -> Unit;
typealias InnerAudioContextOnStopCallback = (res: GeneralCallbackResult) -> Unit;
typealias OnTimeUpdateCallback = (res: GeneralCallbackResult) -> Unit;
typealias OnWaitingCallback = (res: GeneralCallbackResult) -> Unit;
interface InnerAudioContext {
    var autoplay: Boolean
    val buffered: Number
    var currentTime: Number
    val duration: Number
    var loop: Boolean
    var obeyMuteSwitch: Boolean
    val paused: Boolean
    var playbackRate: Number
    var referrerPolicy: String
    var src: String
    var startTime: Number
    var volume: Number
    fun destroy()
    fun offCanplay()
    fun offCanplay(listener: OffCanplayCallback?)
    fun offEnded()
    fun offEnded(listener: OffEndedCallback?)
    fun offError()
    fun offError(listener: InnerAudioContextOffErrorCallback?)
    fun offPause()
    fun offPause(listener: OffPauseCallback?)
    fun offPlay()
    fun offPlay(listener: OffPlayCallback?)
    fun offSeeked()
    fun offSeeked(listener: OffSeekedCallback?)
    fun offSeeking()
    fun offSeeking(listener: OffSeekingCallback?)
    fun offStop()
    fun offStop(listener: OffStopCallback?)
    fun offTimeUpdate()
    fun offTimeUpdate(listener: OffTimeUpdateCallback?)
    fun offWaiting()
    fun offWaiting(listener: OffWaitingCallback?)
    fun onCanplay(listener: OnCanplayCallback)
    fun onEnded(listener: OnEndedCallback)
    fun onError(listener: InnerAudioContextOnErrorCallback)
    fun onPause(listener: OnPauseCallback)
    fun onPlay(listener: OnPlayCallback)
    fun onSeeked(listener: OnSeekedCallback)
    fun onSeeking(listener: OnSeekingCallback)
    fun onStop(listener: InnerAudioContextOnStopCallback)
    fun onTimeUpdate(listener: OnTimeUpdateCallback)
    fun onWaiting(listener: OnWaitingCallback)
    fun pause()
    fun play()
    fun seek(position: Number)
    fun stop()
    fun setAudioOutput(outputType: Number)
}
val UniErrorSubject = "lime-audio-manager";
val errorCodes: Map<ErrorCode, String> = Map(utsArrayOf(
    utsArrayOf(
        10001,
        "系统错误"
    ),
    utsArrayOf(
        10002,
        "网络错误"
    ),
    utsArrayOf(
        10003,
        "文件错误"
    ),
    utsArrayOf(
        10004,
        "格式错误"
    ),
    utsArrayOf(
        -1,
        "未知错误"
    )
));
open class InnerAudioContextOnErrorListenerResultImpl : UniError, InnerAudioContextOnErrorListenerResult {
    constructor(errCode: ErrorCode, errMsg: String? = null) : super() {
        this.errSubject = UniErrorSubject;
        this.errCode = errCode;
        this.errMsg = errMsg ?: errorCodes.get(errCode) ?: "";
    }
}
open class GeneralCallbackResultImpl : GeneralCallbackResult {
    override var errMsg: String;
    constructor(errMsg: String){
        this.errMsg = errMsg;
    }
}
open class InnerAudioContextImpl : InnerAudioContext {
    @Volatile
    private var mediaPlayer: MediaPlayer? = null;
    private var _src: String = "";
    override var autoplay: Boolean = false;
    private var _buffered: Number = 0;
    private var _currentTime: Number = 0;
    private var _duration: Number = 0;
    private var _paused: Boolean = false;
    private var _loop: Boolean = false;
    override var obeyMuteSwitch: Boolean = true;
    private var _playbackRate: Number = 1;
    override var referrerPolicy: String = "";
    override var startTime: Number = 0;
    private var _volume: Number = 1;
    private var _timer: Number = -1;
    private var _isPrepared: Boolean = false;
    private var OnCanplayCallbackArray: UTSArray<OnCanplayCallback> = utsArrayOf();
    private var OnEndedCallbackArray: UTSArray<OnEndedCallback> = utsArrayOf();
    private var InnerAudioContextOnStopCallbackArray: UTSArray<InnerAudioContextOnStopCallback> = utsArrayOf();
    private var InnerAudioContextOnErrorCallbackArray: UTSArray<InnerAudioContextOnErrorCallback> = utsArrayOf();
    private var OnPauseCallbackArray: UTSArray<OnPauseCallback> = utsArrayOf();
    private var OnPlayCallbackArray: UTSArray<OnPlayCallback> = utsArrayOf();
    private var OnSeekedCallbackArray: UTSArray<OnSeekedCallback> = utsArrayOf();
    private var OnSeekingCallbackArray: UTSArray<OnSeekingCallback> = utsArrayOf();
    private var OnTimeUpdateCallbackArray: UTSArray<OnTimeUpdateCallback> = utsArrayOf();
    private var OnWaitingCallbackArray: UTSArray<OnWaitingCallback> = utsArrayOf();
    constructor(){
        this.mediaPlayer = MediaPlayer();
        this.mediaPlayer?.setOnBufferingUpdateListener(fun(_: MediaPlayer, percent: Int){
            this._buffered = UTSNumber.from(percent);
            val res = GeneralCallbackResultImpl("缓冲中：" + percent.toString());
            this.OnWaitingCallbackArray.forEach(fun(listener){
                listener(res);
            }
            );
        }
        );
        this.mediaPlayer?.setOnPreparedListener(fun(_: MediaPlayer){
            this._isPrepared = true;
            if (this.autoplay && this.paused) {
                this.play();
            }
            val res = GeneralCallbackResultImpl("ok");
            this.OnCanplayCallbackArray.forEach(fun(listener){
                listener(res);
            }
            );
        }
        );
        this.mediaPlayer?.setOnCompletionListener(fun(_: MediaPlayer){
            clearTimeout(this._timer);
            val res = GeneralCallbackResultImpl("播放完毕");
            this.OnEndedCallbackArray.forEach(fun(listener){
                listener(res);
            }
            );
        }
        );
        this.mediaPlayer?.setOnErrorListener(fun(_: MediaPlayer, what: Int, extra: Int): Boolean {
            var result: InnerAudioContextOnErrorListenerResult?;
            if (!this.isNetworkError()) {
                result = InnerAudioContextOnErrorListenerResultImpl(10002);
            } else if (MediaPlayer.MEDIA_ERROR_IO == what) {
                result = InnerAudioContextOnErrorListenerResultImpl(10003);
            } else if (MediaPlayer.MEDIA_ERROR_MALFORMED == extra) {
                result = InnerAudioContextOnErrorListenerResultImpl(10004);
            } else {
                result = InnerAudioContextOnErrorListenerResultImpl(-1);
            }
            this.InnerAudioContextOnErrorCallbackArray.forEach(fun(listener){
                listener(result);
            }
            );
            return true;
        }
        );
        this.mediaPlayer?.setOnSeekCompleteListener(fun(_: MediaPlayer){
            val res = GeneralCallbackResultImpl("跳转完毕");
            this.OnSeekedCallbackArray.forEach(fun(listener){
                listener(res);
            }
            );
            if (!this.paused) {
                clearTimeout(this._timer);
                this.updatePlaybackProgress();
            }
        }
        );
    }
    private fun updatePlaybackProgress() {
        if (this.mediaPlayer == null && this.paused && this.OnTimeUpdateCallbackArray.length > 0) {
            return;
        }
        val res = GeneralCallbackResultImpl("\u64AD\u653E\u8FDB\u5EA6: " + this.mediaPlayer?.getCurrentPosition());
        this.OnTimeUpdateCallbackArray.forEach(fun(listener){
            listener(res);
        }
        );
        this._timer = setTimeout(fun(){
            this.updatePlaybackProgress();
        }
        , 1000);
    }
    @Suppress("DEPRECATION")
    private fun isNetworkError(): Boolean {
        val manager = UTSAndroid.getAppContext()!!.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val network = manager.activeNetwork;
            if (network == null) {
                return false;
            }
            val it = manager.getNetworkCapabilities(network);
            if (it?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true || it?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true || it?.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) == true || it?.hasTransport(NetworkCapabilities.TRANSPORT_BLUETOOTH) == true || it?.hasTransport(NetworkCapabilities.TRANSPORT_VPN) == true) {
                return true;
            }
        } else {
            return manager.activeNetworkInfo?.isConnected == true;
        }
        return false;
    }
    override var volume: Number
        get(): Number {
            return this._volume;
        }
        set(volume: Number) {
            if (volume < 0 || volume > 1) {
                return;
            }
            this._volume = volume;
            this.mediaPlayer?.setVolume(volume.toFloat(), volume.toFloat());
        }
    override var loop: Boolean
        get(): Boolean {
            return this.mediaPlayer?.isLooping() ?: this._loop;
        }
        set(param0: Boolean) {
            this.mediaPlayer?.setLooping(param0);
        }
    override val buffered: Number
        get(): Number {
            return this._buffered;
        }
    override var currentTime: Number
        get(): Number {
            return (this.mediaPlayer?.getCurrentPosition() ?: this._currentTime) / 1000;
        }
        set(s: Number) {
            this._currentTime = s * 1000;
            this.mediaPlayer?.seekTo(this._currentTime.toInt());
        }
    override val duration: Number
        get(): Number {
            return (this.mediaPlayer?.getDuration() ?: this._duration) / 1000;
        }
    override val paused: Boolean
        get(): Boolean {
            if (this.mediaPlayer == null) {
                return this._paused;
            }
            return !this.mediaPlayer!!.isPlaying();
        }
    override var src: String
        get(): String {
            return this._src;
        }
        set(v: String) {
            this._src = v;
            if (v.startsWith("/static")) {
                this._src = UTSAndroid.convert2AbsFullPath(v);
            }
            try {
                clearTimeout(this._timer);
                this._isPrepared = false;
                this.mediaPlayer?.stop();
                this.mediaPlayer?.reset();
                this.mediaPlayer?.setDataSource(this._src);
                this.mediaPlayer?.prepareAsync();
            }
             catch (e: Throwable) {
                this.InnerAudioContextOnErrorCallbackArray.forEach(fun(listener){
                    listener(InnerAudioContextOnErrorListenerResultImpl(10003));
                }
                );
            }
        }
    override var playbackRate: Number
        get(): Number {
            val rate: Number? = this.mediaPlayer?.getPlaybackParams()!!.getSpeed();
            return rate ?: this._playbackRate;
        }
        set(speed: Number) {
            if (speed <= 0 || speed > 8 || this.mediaPlayer == null) {
                return;
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val params = PlaybackParams();
                params.setSpeed(speed.toFloat());
                this.mediaPlayer!!.setPlaybackParams(params);
            }
        }
    override fun destroy() {
        clearTimeout(this._timer);
        this.mediaPlayer?.release();
        this.mediaPlayer = null;
        this.OnCanplayCallbackArray = utsArrayOf();
        this.OnEndedCallbackArray = utsArrayOf();
        this.InnerAudioContextOnStopCallbackArray = utsArrayOf();
        this.InnerAudioContextOnErrorCallbackArray = utsArrayOf();
        this.OnPauseCallbackArray = utsArrayOf();
        this.OnPlayCallbackArray = utsArrayOf();
        this.OnSeekedCallbackArray = utsArrayOf();
        this.OnSeekingCallbackArray = utsArrayOf();
        this.OnTimeUpdateCallbackArray = utsArrayOf();
        this.OnWaitingCallbackArray = utsArrayOf();
    }
    override fun offCanplay(): Unit {
        this.offCanplay(null);
    }
    override fun offCanplay(listener: OnCanplayCallback?) {
        if (listener == null) {
            this.OnCanplayCallbackArray = utsArrayOf();
        } else {
            this.OnCanplayCallbackArray = this.OnCanplayCallbackArray.filter(fun(callback): Boolean {
                return callback !== listener;
            }
            );
        }
    }
    override fun offEnded(): Unit {
        this.offEnded(null);
    }
    override fun offEnded(listener: OnEndedCallback?) {
        if (listener == null) {
            this.OnEndedCallbackArray = utsArrayOf();
        } else {
            this.OnEndedCallbackArray = this.OnEndedCallbackArray.filter(fun(callback): Boolean {
                return callback !== listener;
            }
            );
        }
    }
    override fun offError(): Unit {
        this.offError(null);
    }
    override fun offError(listener: InnerAudioContextOnErrorCallback?) {
        if (listener == null) {
            this.InnerAudioContextOnErrorCallbackArray = utsArrayOf();
        } else {
            this.InnerAudioContextOnErrorCallbackArray = this.InnerAudioContextOnErrorCallbackArray.filter(fun(callback): Boolean {
                return callback !== listener;
            }
            );
        }
    }
    override fun offPause(): Unit {
        this.offPause(null);
    }
    override fun offPause(listener: OnPauseCallback?) {
        if (listener == null) {
            this.OnPauseCallbackArray = utsArrayOf();
        } else {
            this.OnPauseCallbackArray = this.OnPauseCallbackArray.filter(fun(callback): Boolean {
                return callback !== listener;
            }
            );
        }
    }
    override fun offPlay(): Unit {
        this.offPlay(null);
    }
    override fun offPlay(listener: OnPlayCallback?) {
        if (listener == null) {
            this.OnPlayCallbackArray = utsArrayOf();
        } else {
            this.OnPlayCallbackArray = this.OnPlayCallbackArray.filter(fun(callback): Boolean {
                return callback !== listener;
            }
            );
        }
    }
    override fun offSeeked(): Unit {
        this.offSeeked(null);
    }
    override fun offSeeked(listener: OnSeekedCallback?) {
        if (listener == null) {
            this.OnSeekedCallbackArray = utsArrayOf();
        } else {
            this.OnSeekedCallbackArray = this.OnSeekedCallbackArray.filter(fun(callback): Boolean {
                return callback !== listener;
            }
            );
        }
    }
    override fun offSeeking(): Unit {
        this.offSeeking(null);
    }
    override fun offSeeking(listener: OnSeekingCallback?) {
        if (listener == null) {
            this.OnSeekingCallbackArray = utsArrayOf();
        } else {
            this.OnSeekingCallbackArray = this.OnSeekingCallbackArray.filter(fun(callback): Boolean {
                return callback !== listener;
            }
            );
        }
    }
    override fun offStop(): Unit {
        this.offStop(null);
    }
    override fun offStop(listener: InnerAudioContextOnStopCallback?) {
        if (listener == null) {
            this.InnerAudioContextOnStopCallbackArray = utsArrayOf();
        } else {
            this.InnerAudioContextOnStopCallbackArray = this.InnerAudioContextOnStopCallbackArray.filter(fun(callback): Boolean {
                return callback !== listener;
            }
            );
        }
    }
    override fun offTimeUpdate(): Unit {
        this.offTimeUpdate(null);
    }
    override fun offTimeUpdate(listener: OnTimeUpdateCallback?) {
        if (listener == null) {
            this.OnTimeUpdateCallbackArray = utsArrayOf();
        } else {
            this.OnTimeUpdateCallbackArray = this.OnTimeUpdateCallbackArray.filter(fun(callback): Boolean {
                return callback !== listener;
            }
            );
        }
    }
    override fun offWaiting(): Unit {
        this.offWaiting(null);
    }
    override fun offWaiting(listener: OnWaitingCallback?) {
        if (listener == null) {
            this.OnCanplayCallbackArray = utsArrayOf();
        } else {
            this.OnCanplayCallbackArray = this.OnCanplayCallbackArray.filter(fun(callback): Boolean {
                return callback !== listener;
            }
            );
        }
    }
    override fun onCanplay(listener: OnCanplayCallback) {
        this.OnCanplayCallbackArray.push(listener);
    }
    override fun onEnded(listener: OnEndedCallback) {
        this.OnEndedCallbackArray.push(listener);
    }
    override fun onError(listener: InnerAudioContextOnErrorCallback) {
        this.InnerAudioContextOnErrorCallbackArray.push(listener);
    }
    override fun onPause(listener: OnPauseCallback) {
        this.OnPauseCallbackArray.push(listener);
        clearTimeout(this._timer);
    }
    override fun onPlay(listener: OnPlayCallback) {
        this.OnPlayCallbackArray.push(listener);
        clearTimeout(this._timer);
        if (this.paused) {
            return;
        }
        this.updatePlaybackProgress();
    }
    override fun onSeeked(listener: OnSeekedCallback) {
        this.OnSeekedCallbackArray.push(listener);
    }
    override fun onSeeking(listener: OnSeekingCallback) {
        this.OnSeekingCallbackArray.push(listener);
    }
    override fun onStop(listener: InnerAudioContextOnStopCallback) {
        this.InnerAudioContextOnStopCallbackArray.push(listener);
        clearTimeout(this._timer);
    }
    override fun onTimeUpdate(listener: OnTimeUpdateCallback) {
        this.OnTimeUpdateCallbackArray.push(listener);
        clearTimeout(this._timer);
        if (this.paused) {
            return;
        }
        this.updatePlaybackProgress();
    }
    override fun onWaiting(listener: OnWaitingCallback) {
        this.OnWaitingCallbackArray.push(listener);
    }
    override fun pause() {
        if (this.mediaPlayer == null) {
            return;
        }
        this.mediaPlayer!!.pause();
        clearTimeout(this._timer);
        if (this.paused) {
            val res = GeneralCallbackResultImpl("暂停");
            this.OnPauseCallbackArray.forEach(fun(listener){
                listener(res);
            }
            );
        }
    }
    override fun play() {
        if (this.mediaPlayer == null) {
            return;
        }
        if (this.paused) {
            this.mediaPlayer!!.start();
        }
        if (!this.paused) {
            val res = GeneralCallbackResultImpl("播放");
            this.OnPlayCallbackArray.forEach(fun(listener){
                listener(res);
            }
            );
            clearTimeout(this._timer);
            this.updatePlaybackProgress();
        }
    }
    override fun seek(position: Number) {
        if (this.mediaPlayer == null) {
            return;
        }
        this._currentTime = position * 1000;
        this.mediaPlayer!!.seekTo(this._currentTime.toInt());
        val res = GeneralCallbackResultImpl("跳转中");
        this.OnSeekingCallbackArray.forEach(fun(listener){
            listener(res);
        }
        );
    }
    override fun stop() {
        if (this.mediaPlayer == null) {
            return;
        }
        this.mediaPlayer!!.stop();
        clearTimeout(this._timer);
        if (this.paused) {
            val res = GeneralCallbackResultImpl("停止");
            this.InnerAudioContextOnStopCallbackArray.forEach(fun(listener){
                listener(res);
            }
            );
        }
    }
    override fun setAudioOutput(outputType: Number) {
        if (this.mediaPlayer == null) {
            return;
        }
        if (outputType == 0) {
            val audioAttributesLoudspeaker = AudioAttributes.Builder().setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).setUsage(AudioAttributes.USAGE_MEDIA).build();
            this.mediaPlayer!!.setAudioAttributes(audioAttributesLoudspeaker);
        } else if (outputType == 1) {
            val audioAttributesLoudspeaker = AudioAttributes.Builder().setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION).build();
            this.mediaPlayer!!.setAudioAttributes(audioAttributesLoudspeaker);
        }
    }
}
fun createInnerAudioContext(): InnerAudioContext {
    return InnerAudioContextImpl();
}
fun createInnerAudioContextByJs(): Int {
    val ins = createInnerAudioContext();
    return UTSBridge.registerJavaScriptClassInstance(InnerAudioContextByJsProxy(ins));
}
open class InnerAudioContextByJsProxy {
    open var __instance: InnerAudioContext;
    constructor(ins: InnerAudioContext){
        __instance = ins;
    }
    open var autoplay: Boolean
        get() {
            return __instance.autoplay;
        }
        set(value) {
            __instance.autoplay = value;
        }
    open val buffered: Number
        get() {
            return __instance.buffered;
        }
    open var currentTime: Number
        get() {
            return __instance.currentTime;
        }
        set(value) {
            __instance.currentTime = value;
        }
    open val duration: Number
        get() {
            return __instance.duration;
        }
    open var loop: Boolean
        get() {
            return __instance.loop;
        }
        set(value) {
            __instance.loop = value;
        }
    open var obeyMuteSwitch: Boolean
        get() {
            return __instance.obeyMuteSwitch;
        }
        set(value) {
            __instance.obeyMuteSwitch = value;
        }
    open val paused: Boolean
        get() {
            return __instance.paused;
        }
    open var playbackRate: Number
        get() {
            return __instance.playbackRate;
        }
        set(value) {
            __instance.playbackRate = value;
        }
    open var referrerPolicy: String
        get() {
            return __instance.referrerPolicy;
        }
        set(value) {
            __instance.referrerPolicy = value;
        }
    open var src: String
        get() {
            return __instance.src;
        }
        set(value) {
            __instance.src = value;
        }
    open var startTime: Number
        get() {
            return __instance.startTime;
        }
        set(value) {
            __instance.startTime = value;
        }
    open var volume: Number
        get() {
            return __instance.volume;
        }
        set(value) {
            __instance.volume = value;
        }
    public open fun destroyByJs(): Unit {
        return __instance.destroy();
    }
    public open fun offCanplayByJs(): Unit {
        return __instance.offCanplay();
    }
    public open fun offCanplayByJs(listener: UTSCallback?): Unit {
        return __instance.offCanplay(fun(res: GeneralCallbackResult){
            listener?.invoke(res);
        }
        );
    }
    public open fun offEndedByJs(): Unit {
        return __instance.offEnded();
    }
    public open fun offEndedByJs(listener: UTSCallback?): Unit {
        return __instance.offEnded(fun(res: GeneralCallbackResult){
            listener?.invoke(res);
        }
        );
    }
    public open fun offErrorByJs(): Unit {
        return __instance.offError();
    }
    public open fun offErrorByJs(listener: UTSCallback?): Unit {
        return __instance.offError(fun(result: InnerAudioContextOnErrorListenerResult){
            listener?.invoke(result);
        }
        );
    }
    public open fun offPauseByJs(): Unit {
        return __instance.offPause();
    }
    public open fun offPauseByJs(listener: UTSCallback?): Unit {
        return __instance.offPause(fun(res: GeneralCallbackResult){
            listener?.invoke(res);
        }
        );
    }
    public open fun offPlayByJs(): Unit {
        return __instance.offPlay();
    }
    public open fun offPlayByJs(listener: UTSCallback?): Unit {
        return __instance.offPlay(fun(res: GeneralCallbackResult){
            listener?.invoke(res);
        }
        );
    }
    public open fun offSeekedByJs(): Unit {
        return __instance.offSeeked();
    }
    public open fun offSeekedByJs(listener: UTSCallback?): Unit {
        return __instance.offSeeked(fun(res: GeneralCallbackResult){
            listener?.invoke(res);
        }
        );
    }
    public open fun offSeekingByJs(): Unit {
        return __instance.offSeeking();
    }
    public open fun offSeekingByJs(listener: UTSCallback?): Unit {
        return __instance.offSeeking(fun(res: GeneralCallbackResult){
            listener?.invoke(res);
        }
        );
    }
    public open fun offStopByJs(): Unit {
        return __instance.offStop();
    }
    public open fun offStopByJs(listener: UTSCallback?): Unit {
        return __instance.offStop(fun(res: GeneralCallbackResult){
            listener?.invoke(res);
        }
        );
    }
    public open fun offTimeUpdateByJs(): Unit {
        return __instance.offTimeUpdate();
    }
    public open fun offTimeUpdateByJs(listener: UTSCallback?): Unit {
        return __instance.offTimeUpdate(fun(res: GeneralCallbackResult){
            listener?.invoke(res);
        }
        );
    }
    public open fun offWaitingByJs(): Unit {
        return __instance.offWaiting();
    }
    public open fun offWaitingByJs(listener: UTSCallback?): Unit {
        return __instance.offWaiting(fun(res: GeneralCallbackResult){
            listener?.invoke(res);
        }
        );
    }
    public open fun onCanplayByJs(listener: UTSCallback): Unit {
        return __instance.onCanplay(fun(res: GeneralCallbackResult){
            listener(res);
        }
        );
    }
    public open fun onEndedByJs(listener: UTSCallback): Unit {
        return __instance.onEnded(fun(res: GeneralCallbackResult){
            listener(res);
        }
        );
    }
    public open fun onErrorByJs(listener: UTSCallback): Unit {
        return __instance.onError(fun(result: InnerAudioContextOnErrorListenerResult){
            listener(result);
        }
        );
    }
    public open fun onPauseByJs(listener: UTSCallback): Unit {
        return __instance.onPause(fun(res: GeneralCallbackResult){
            listener(res);
        }
        );
    }
    public open fun onPlayByJs(listener: UTSCallback): Unit {
        return __instance.onPlay(fun(res: GeneralCallbackResult){
            listener(res);
        }
        );
    }
    public open fun onSeekedByJs(listener: UTSCallback): Unit {
        return __instance.onSeeked(fun(res: GeneralCallbackResult){
            listener(res);
        }
        );
    }
    public open fun onSeekingByJs(listener: UTSCallback): Unit {
        return __instance.onSeeking(fun(res: GeneralCallbackResult){
            listener(res);
        }
        );
    }
    public open fun onStopByJs(listener: UTSCallback): Unit {
        return __instance.onStop(fun(res: GeneralCallbackResult){
            listener(res);
        }
        );
    }
    public open fun onTimeUpdateByJs(listener: UTSCallback): Unit {
        return __instance.onTimeUpdate(fun(res: GeneralCallbackResult){
            listener(res);
        }
        );
    }
    public open fun onWaitingByJs(listener: UTSCallback): Unit {
        return __instance.onWaiting(fun(res: GeneralCallbackResult){
            listener(res);
        }
        );
    }
    public open fun pauseByJs(): Unit {
        return __instance.pause();
    }
    public open fun playByJs(): Unit {
        return __instance.play();
    }
    public open fun seekByJs(position: Number): Unit {
        return __instance.seek(position);
    }
    public open fun stopByJs(): Unit {
        return __instance.stop();
    }
    public open fun setAudioOutputByJs(outputType: Number): Unit {
        return __instance.setAudioOutput(outputType);
    }
}
