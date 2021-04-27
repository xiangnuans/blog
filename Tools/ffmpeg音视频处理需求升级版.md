# ffmpeg音视频处理需求升级版

## 需求
图片转视频、视屏拼接、音频合并、音视频合成，加视频封面（目前这条还没合并在一条命令）
刚开始单命令实现，但是这样会产生多个中间文件，前面的文章已经介绍过了。优化，希望合并为一条命令搞定
在次研究实现过程中踩了几个坑，记录一下：合成过程采用渐进式的方式加入每个小功能点

## 图片转视频加背景音乐

```shell
ffmpeg -f image2 \
       -loop 1 \
       -i img.jpg \
       -f s16le \
       -ac 1 \
       -ar 16k \
       -i wd.pcm \
       -t 5 \
       -vcodec mpeg4 output.mp4
```


## 视频拼接

```shell
ffmpeg -i v4.mp4 -i v2.mp4 \
   -filter_complex '[0:v]scale=720:1280[in1];
                    [1:v]scale=720:1280[in2];
                    [in1][0:a][in2][1:a] concat=n=2:v=1:a=1 [v] [a]' \
   -map [v] -map [a] -c:v libx264 d1.mp4
```

注意：
- scale=720:1280指定统一拼接视屏的尺寸，否则 不同尺寸的的视频拼接错误

## 视频拼接并去除声音

```shell
ffmpeg -i v4.mp4 -i v2.mp4 \
   -filter_complex '[0:v]scale=720:1280[in1];
                    [1:v]scale=720:1280[in2];
                    [in1][in2] concat=n=2:v=1:a=0 [v]' \
   -map [v] -c:v libx264 dc1.mp4
```

## 视频（去除声音）拼接、音频合成

```shell
ffmpeg -i v4.mp4 -i v2.mp4 -i audio.wav \
   -filter_complex '[0:v]scale=720:1280[in1];
                    [1:v]scale=720:1280[in2];
                    [in1][in2] concat=n=2:v=1:a=0 [v]; [1:a][2:a] concat=n=2:v=0:a=1 [a]' \
   -map [v] -map [a] -c:v libx264 dca1.mp4
```

# 图片转视频封面、加背景音乐、拼接视频、加音频合成

```shell
ffmpeg -i WechatIMG612.png \
       -i v4.mp4 \
       -i v2.mp4 \
       -i audio1.wav \
       -i t.wav \
       -filter_complex '[0]scale=720:1280[in0];
                        [1:v]scale=720:1280[in1];
                        [2:v]scale=720:1280[in2];
                        [in0][in1][in2] concat=n=3:v=1:a=0 [v];
                        [4:a][3:a] amix=inputs=2:duration=longest [a]' \
       -map [v] -map [a] -c:v libx264 -pix_fmt yuv420p -c:a aac cc1.mp4
```

注意：

- -pix_fmt yuv420p指定可以支持 不同格式的图片转视频，否则，只支持png的格式
- amix默认是2，所以可以只写amix,
- duration=longest,按最长音频输出

但这样写，存在问题，音频比视频长，则视频播放完成，音频会一直播放下去，需求中是按视频播放总时长

尝试解决方案：

**方案一：amerge：但音频会按最短音频输出**

```shell
ffmpeg -i t.wav \
       -i audio.mp3 \
       -filter_complex '[0:a][1:a] amerge [a]' \
       -map [a] -c:a aac -b:a 256k vv.mp3
```

**方案二：join,和merge同样的**

```shell

ffmpeg -i t.wav \
       -i audio.mp3 \
       -filter_complex '[0:a][1:a] join [a]' \
       -map [a] -c:a aac -b:a 256k vv.mp3
```

**方案三：-shortest：测试结果只支持 单音频时，可以这样实现**

```shell
ffmpeg -i v1.mp4 \
       -i audio.mp3 \
       -filter_complex "[0:a][1:a]amerge=inputs=2[a]" \
       -map 0:v -map "[a]" -c:v copy -c:a libvorbis -ac 2 -shortest out.mp4
```

**方案四：-t在最后指定播放总时长(目前只能使用这种方式)**

```shell
ffmpeg -i WechatIMG612.png \
       -i v4.mp4 \
       -i v2.mp4 \
       -i audio1.wav \
       -i t.wav \
       -filter_complex '[0]scale=720:1280[in0];
                        [1:v]scale=720:1280[in1];
                        [2:v]scale=720:1280[in2];
                        [in0][in1][in2] concat=n=3:v=1:a=0 [v];
                        [4:a][3:a] amix=inputs=2:duration=longest [a]' \
       -map [v] -map [a] -c:v libx264 -pix_fmt yuv420p -c:a aac -t 23 cc1.mp4

```

## 图片转视频默认只有一帧，设定持续时长

```shell
ffmpeg -i f.png \
       -i 1.mp4 \
       -i 2.mp4 \
       -i audio.mp3 \
        -i t.wav \
       -filter_complex '[0]scale=720:1280,setpts=PTS+7/TB[in0];
                        [1:v]scale=720:1280[in1];
                        [2:v]scale=720:1280[in2];
                        [in0][in1][in2] concat=n=3:v=1:a=0 [v];
                        [3:a][4:a] amix [a]' \
       -map [v] -map [a] -c:v libx264 -pix_fmt yuv420p -c:a aac -t 23 cc1.mp4

```

- setpts=PTS+5/TB  为输出视频帧设置PTS。
- TB: 输入时间戳的时基。
- PTS: 输入的时间戳

## 音频延迟播放

```shell
ffmpeg -i f.png \
       -i 1.mp4 \
       -i 2.mp4 \
       -i audio.mp3 \
        -i t.wav \
       -filter_complex '[0]scale=720:1280,setpts=PTS+6/TB[in0];
                        [1:v]scale=720:1280[in1];
                        [2:v]scale=720:1280[in2];
                        [in0][in1][in2] concat=n=3:v=1:a=0 [v];
                        [3:a][4:a] amix,adelay=1000|1000 [a]' \
       -map [v] -map [a] -c:v libx264 -pix_fmt yuv420p -c:a aac -t 23 cc1.mp4

```

- setpts偏移时间-adelay时间=图片视频持续时间
- adelay=1000|1000：两个音频延迟播放时间，单位为ms


## 推流

```shell
ffmpeg -i f.jpg \
       -i 1.mp4 \
       -i long.mp4 \
       -i audio.mp3 \
       -i t.wav \
       -filter_complex '[0]scale=720:1280,setpts=PTS+6/TB[in0];
                        [1:v]scale=720:1280[in1];
                        [2:v]scale=720:1280[in2];
                        [in0][in1][in2] concat=n=3:v=1:a=0 [v];
                        [3:a]adelay=30s|30s[a3];
                        [4:a]adelay=60s|60s[a4];
                        [a3][a4]amix[a]' \
       -map [v] \
       -map [a] \
       -pix_fmt yuv420p \
       -c:v libx264 \
       -c:a aac \
       -t 300 \
       -f flv "rtmp://..."
```

## 本地拉流

```shell
ffmpeg -i "https://"
       -codec copy \
       -f mp4 rr.mp4
```

## 添加水印

### 图片水印

```shell
ffmpeg -i 4.mp4 \
       -i sy.png \
       -filter_complex "overlay=10:10" birds2.mp4
```

### 添加文字水印

```shell
ffmpeg -i 4.mp4 \
   -vf "drawtext=fontfile=/Library/Fonts/AdobeHeitiStd-Regular.otf:text='watermark测试':x=30:y=h-30:enable='if(gte(t,3),0,1)':fontsize=24:fontcolor=white@0.7" output.mp4
```

### 添加水印后推流

```shell

ffmpeg -i f.jpg \
       -i 1.mp4 \
       -i long.mp4 \
       -i audio.mp3 \
       -i t.wav \
       -i sy.png \
       -filter_complex '[0]scale=720:1280,setpts=PTS+6/TB[in0];
                        [1:v]scale=720:1280[in1];
                        [2:v]scale=720:1280[in2];
                        [in0][in1][in2] concat=n=3:v=1:a=0 [v];
                        [3:a]adelay=30s|30s[a3];
                        [4:a]adelay=60s|60s[a4];
                        [a3][a4]amix[a];
                        [v][5:v]overlay[out]' \
       -map [out] \
       -map [a] \
       -pix_fmt yuv420p \
       -c:v libx264 \
       -c:a aac \
       -t 300 \
       -f flv "rtmp://...."
```

### 循环推流

```shell
## 循环推流

ffmpeg -re \
       -stream_loop 4 \
       -i 1.mp4 \
       -c:v libx264 \
       -f flv "rtmp://"
```

- overlay 添加水印
- amix 混合音频 默认值为2
- adelay 延迟播放时间
- scale 分辨率大小 720:1280 手机屏的
- setpts 图片持续时长
- pix_fmt: yuv420p 像素格式 视频默认像素格式所有图片与视频拼接也需要转换
- -c:v libx264视频编码
- -c:a aac音频编码
- -f flv 流媒体封装

合并中，最重要的命令-filter_complex支持的参数

```
Filters:
  T.. = Timeline support // 时间线支持
  .S. = Slice threading  // 切片线程
  ..C = Command support
  A = Audio input/output
  V = Video input/output
  N = Dynamic number and/or type of input/output // 动态输入/输出数和/或类型
  | = Source or sink filter  // 源或汇滤波器
 ... abench            A->A       Benchmark part of a filtergraph.  // filtergraph的基准部分。
 ... acompressor       A->A       Audio compressor.  // 音频压缩器
 ... acontrast         A->A       Simple audio dynamic range compression/expansion filter.  // 简单的音频动态范围压缩/扩展过滤器。
 ... acopy             A->A       Copy the input audio unchanged to the output.  // 将输入音频原封不动地复制到输出。
 ... acue              A->A       Delay filtering to match a cue. // 延迟过滤以匹配提示。
 ... acrossfade        AA->A      Cross fade two input audio streams.  // 交叉淡入两个输入音频流。
 ... acrossover        A->N       Split audio into per-bands streams.  // 将音频分割为每个频带的流。
 ... acrusher          A->A       Reduce audio bit resolution. // 降低音频位分辨率。
 .S. adeclick          A->A       Remove impulsive noise from input audio.  // 去除输入音频中的脉冲噪声。
 .S. adeclip           A->A       Remove clipping from input audio. // 从输入音频中删除剪辑。
 T.. adelay            A->A       Delay one or more audio channels. // 延迟一个或多个音频通道。
 ... aderivative       A->A       Compute derivative of input audio.  // 计算输入音频的导数。
 ... aecho             A->A       Add echoing to the audio. // 在音频中添加回声。
 ... aemphasis         A->A       Audio emphasis. // 音频强调
 ... aeval             A->A       Filter audio signal according to a specified expression. // 根据指定的表达式过滤音频信号。
 T.. afade             A->A       Fade in/out input audio.   // 淡入/淡出输入音频。
 TSC afftdn            A->A       Denoise audio samples using FFT. // 使用FFT对音频样本进行去噪。
 ... afftfilt          A->A       Apply arbitrary expressions to samples in frequency domain. // 对频域中的样本应用任意表达式。
 .S. afir              AA->N      Apply Finite Impulse Response filter with supplied coefficients in 2nd stream. // 在第二个流中应用具有提供系数的有限脉冲响应滤波器
 ... aformat           A->A       Convert the input audio to one of the specified formats.  // 将输入音频转换为指定格式之一。
 ... agate             A->A       Audio gate. // 音频门
 .S. aiir              A->N       Apply Infinite Impulse Response filter with supplied coefficients.  // 应用具有提供系数的无限冲激响应滤波器。
 ... aintegral         A->A       Compute integral of input audio.  // 计算输入音频的积分。
 ... ainterleave       N->A       Temporally interleave audio inputs.  // 暂时交错音频输入。
 ... alimiter          A->A       Audio lookahead limiter.  // 音频前视限制器。
 TSC allpass           A->A       Apply a two-pole all-pass filter.  // 使用两极全通滤波器。
 ... aloop             A->A       Loop audio samples.  // 循环音频示例
 ... amerge            N->A       Merge two or more audio streams into a single multi-channel stream. // 将两个或多个音频流合并为单个多通道流。
 T.. ametadata         A->A       Manipulate audio frame metadata. //操纵音频帧元数据。
 ... amix              N->A       Audio mixing.  // 音频混合
 ... amultiply         AA->A      Multiply two audio streams.  // 将两个音频流相乘。
 ..C anequalizer       A->N       Apply high-order audio parametric multi band equalizer. // 采用高阶音频参数多波段均衡器。
 TSC anlmdn            A->A       Reduce broadband noise from stream using Non-Local Means. // 使用非本地手段减少流的宽带噪声。
 ... anull             A->A       Pass the source unchanged to the output.  // 将源不变地传递给输出。
 T.. apad              A->A       Pad audio with silence. // 用静音键播放音频。
 ... aperms            A->A       Set permissions for the output audio frame.  // 设置输出音频帧的权限
 ... aphaser           A->A       Add a phasing effect to the audio.  // 为音频添加相位效果。
 ... apulsator         A->A       Audio pulsator.  // 音频脉冲发生器。
 ... arealtime         A->A       Slow down filtering to match realtime.  // 降低过滤速度以匹配实时性。
 ... aresample         A->A       Resample audio data.  // 重新采样音频数据。
 ... areverse          A->A       Reverse an audio clip.   // 反转音频剪辑。
 ... aselect           A->N       Select audio frames to pass in output.  // 选择要传入输出的音频帧。
 ... asendcmd          A->A       Send commands to filters.  // 向筛选器发送命令。
 ... asetnsamples      A->A       Set the number of samples for each output audio frames.  // 设置每个输出音频帧的采样数。
 ... asetpts           A->A       Set PTS for the output audio frame. // 为输出音频帧设置PTS。
 ... asetrate          A->A       Change the sample rate without altering the data.  // 更改采样率而不更改数据。
 ... asettb            A->A       Set timebase for the audio output link.  // 设置音频输出链接的时基。
 ... ashowinfo         A->A       Show textual information for each audio frame.  // 显示每个音频帧的文本信息。
 T.. asidedata         A->A       Manipulate audio frame side data. // 操作音频帧侧数据
 T.. asoftclip         A->A       Audio Soft Clipper.  // 音频软剪辑。
 ... asplit            A->N       Pass on the audio input to N audio outputs.  // 把音频输入传给N个音频输出。
 ... astats            A->A       Show time domain statistics about audio frames.  // 显示有关音频帧的时域统计信息
 ..C astreamselect     N->N       Select audio streams // 选择音频流
 ..C atempo            A->A       Adjust audio tempo.  // 调整音频节奏。
 ... atrim             A->A       Pick one continuous section from the input, drop the rest.  // 从输入中选取一个连续的部分，删除其余部分。
 TSC bandpass          A->A       Apply a two-pole Butterworth band-pass filter.  // 应用两极巴特沃斯带通滤波器。
 TSC bandreject        A->A       Apply a two-pole Butterworth band-reject filter.  // 应用两极巴特沃斯带阻滤波器。
 TSC bass              A->A       Boost or cut lower frequencies.  // 提高或降低低频率。
 TSC biquad            A->A       Apply a biquad IIR filter with the given coefficients.  // 应用具有给定系数的双四IIR滤波器
 ... channelmap        A->A       Remap audio channels. // 重新映射音频通道
 ... channelsplit      A->N       Split audio into per-channel streams.  // 将音频分割为每个频道流。
 ... chorus            A->A       Add a chorus effect to the audio.  // 为音频添加合唱效果。
 ... compand           A->A       Compress or expand audio dynamic range.  // 压缩或扩展音频动态范围
 ... compensationdelay A->A       Audio Compensation Delay Line.  // 音频补偿延迟线。
 T.. crossfeed         A->A       Apply headphone crossfeed filter.  // 应用耳机交叉馈入滤波器。
 ... crystalizer       A->A       Simple expand audio dynamic range filter.  // 简单的扩展音频动态范围过滤器。
 T.. dcshift           A->A       Apply a DC shift to the audio. // 对音频应用DC移位。
 T.. deesser           A->A       Apply de-essing to the audio.  //对音频应用删除操作。
 ... drmeter           A->A       Measure audio dynamic range.  // 测量音频动态范围。
 T.. dynaudnorm        A->A       Dynamic Audio Normalizer.  // 动态音频标准化器。
 ... earwax            A->A       Widen the stereo image.  // 放大立体图像。
 ... ebur128           A->N       EBU R128 scanner.  // EBU R128扫描仪
 TSC equalizer         A->A       Apply two-pole peaking equalization (EQ) filter.  // 采用双极峰值均衡（EQ）滤波器。
 T.. extrastereo       A->A       Increase difference between stereo audio channels.  // 增加立体声音频通道之间的差异。
 ..C firequalizer      A->A       Finite Impulse Response Equalizer.  // 有限脉冲响应均衡器。
 ... flanger           A->A       Apply a flanging effect to the audio.  // 对音频应用翻边效果。
 ... haas              A->A       Apply Haas Stereo Enhancer.  // 应用Haas立体声增强剂。
 ... hdcd              A->A       Apply High Definition Compatible Digital (HDCD) decoding.  // 应用高清晰度兼容数字（HDCD）解码。
 .S. headphone         N->A       Apply headphone binaural spatialization with HRTFs in additional streams.  // 在附加流中应用耳机双耳空间化和HRTFs。
 TSC highpass          A->A       Apply a high-pass filter with 3dB point frequency. // 使用点频率为3dB的高通滤波器。
 TSC highshelf         A->A       Apply a high shelf filter. // 使用高架过滤器。
 ... join              N->A       Join multiple audio streams into multi-channel output. // 将多个音频流连接到多通道输出。
 ... loudnorm          A->A       EBU R128 loudness normalization  // EBU R128响度标准化
 TSC lowpass           A->A       Apply a low-pass filter with 3dB point frequency. // 使用点频率为3dB的低通滤波器。
 TSC lowshelf          A->A       Apply a low shelf filter.  // 使用低架过滤器。
 ... mcompand          A->A       Multiband Compress or expand audio dynamic range.  // 多波段压缩或扩展音频动态范围。
 ... pan               A->A       Remix channels with coefficients (panning).  // 带系数的混音频道（平移）
 ... replaygain        A->A       ReplayGain scanner. // 重新扫描。
 ... resample          A->A       Audio resampling and conversion.  // 音频重采样和转换。
 ..C rubberband        A->A       Apply time-stretching and pitch-shifting.  //应用时间拉伸和俯仰移位。
 ... sidechaincompress AA->A      Sidechain compressor. // 侧链压缩机。
 ... sidechaingate     AA->A      Audio sidechain gate.  // 音频侧链门
 ... silencedetect     A->A       Detect silence.  // 注意安静。
 ... silenceremove     A->A       Remove silence.  // 消除沉默。
 ... stereotools       A->A       Apply various stereo tools. // 使用各种立体声工具。
 T.. stereowiden       A->A       Apply stereo widening effect. // 应用立体加宽效果。
 ... superequalizer    A->A       Apply 18 band equalization filter. // 应用18波段均衡滤波器。
 .S. surround          A->A       Apply audio surround upmix filter. //应用音频环绕上混滤波器。
 TSC treble            A->A       Boost or cut upper frequencies.  // 提高或降低高频。
 ... tremolo           A->A       Apply tremolo effect. // 应用颤音效果。
 ... vibrato           A->A       Apply vibrato effect.  // 应用振动效果。
 T.C volume            A->A       Change input volume. // 更改输入音量。
 ... volumedetect      A->A       Detect audio volume. // 我检测到音频音量。
 ... aevalsrc          |->A       Generate an audio signal generated by an expression. // 生成由表达式生成的音频信号。
 ... anoisesrc         |->A       Generate a noise audio signal.  // 产生噪声音频信号。
 ... anullsrc          |->A       Null audio source, return empty audio frames. // 空音频源，返回空音频帧。
 ... hilbert           |->A       Generate a Hilbert transform FIR coefficients. // 生成Hilbert变换FIR系数。
 ... sinc              |->A       Generate a sinc kaiser-windowed low-pass, high-pass, band-pass, or band-reject FIR coefficients. // 生成sinc-kaiser加窗低通、高通、带通或带阻FIR系数。
 ... sine              |->A       Generate sine wave audio signal. // 产生正弦波音频信号。
 ... anullsink         A->|       Do absolutely nothing with the input audio. // 对输入音频绝对不要做任何事情。
 ... alphaextract      V->N       Extract an alpha channel as a grayscale image component. // 将alpha通道提取为灰度图像组件。
 ... alphamerge        VV->V      Copy the luma value of the second input into the alpha channel of the first input. // 将第二个输入的luma值复制到第一个输入的alpha通道中。
 .S. amplify           V->V       Amplify changes between successive video frames. // 放大连续视频帧之间的变化。
 ... ass               V->V       Render ASS subtitles onto input video using the libass library. // 使用libass库将ASS字幕呈现到输入视频上。
 TS. atadenoise        V->V       Apply an Adaptive Temporal Averaging Denoiser. // 应用自适应时间平均去噪。
 TS. avgblur           V->V       Apply Average Blur filter.  // 应用平均模糊过滤器。
 T.. bbox              V->V       Compute bounding box for each frame. // 计算每个帧的边界框。
 ... bench             V->V       Benchmark part of a filtergraph. // filtergraph的基准部分。
 T.. bitplanenoise     V->V       Measure bit plane noise.  // 测量位平面噪声。
 ... blackdetect       V->V       Detect video intervals that are (almost) black. // 检测（几乎）黑色的视频间隔。
 ... blackframe        V->V       Detect frames that are (almost) black. 检测（几乎）黑色的帧。
 TS. blend             VV->V      Blend two video frames into each other. // 将两个视频帧混合在一起。
 TS. bm3d              N->V       Block-Matching 3D denoiser. // 块匹配三维去噪。
 T.. boxblur           V->V       Blur the input.  // 虚输入
 TS. bwdif             V->V       Deinterlace the input image.  // 取消输入图像的隔行扫描
 TS. chromahold        V->V       Turns a certain color range into gray.  // 将某个颜色范围转换为灰色。
 TS. chromakey         V->V       Turns a certain color into transparency. Operates on YUV colors. // 将某个颜色转换为透明。对YUV颜色进行操作。
 TS. chromashift       V->V       Shift chroma. // 变色
 ... ciescope          V->V       Video CIE scope.  // 视频CIE示波器。
 T.. codecview         V->V       Visualize information about some codecs. // 可视化一些编解码器的信息。
 TS. colorbalance      V->V       Adjust the color balance.  // 调整颜色平衡。
 TS. colorchannelmixer V->V       Adjust colors by mixing color channels.  // 通过混合颜色通道调节颜色。
 TS. colorkey          V->V       Turns a certain color into transparency. Operates on RGB colors. // 将某个颜色转换为透明。对RGB颜色进行操作。
 TS. colorhold         V->V       Turns a certain color range into gray. Operates on RGB colors. // 将某个颜色范围转换为灰色。对RGB颜色进行操作。
 TS. colorlevels       V->V       Adjust the color levels. // 调整颜色级别。
 TS. colormatrix       V->V       Convert color matrix. // 转换颜色矩阵。
 TS. colorspace        V->V       Convert between color spaces. // 在颜色空间之间转换。
 TS. convolution       V->V       Apply convolution filter. // 应用卷积滤波器
 TS. convolve          VV->V      Convolve first video stream with second video stream.  // 将第一视频流与第二视频流卷积。
 ... copy              V->V       Copy the input video unchanged to the output.  // 将输入视频原封不动地复制到输出。
 ... coreimage         V->V       Video filtering using CoreImage API.  // 使用CoreImage API进行视频过滤。
 ... cover_rect        V->V       Find and cover a user specified object. // 查找并覆盖用户指定的对象。
 ..C crop              V->V       Crop the input video.  // 裁剪输入视频
 T.. cropdetect        V->V       Auto-detect crop size. // 自动检测作物大小。
 ... cue               V->V       Delay filtering to match a cue. // 延迟过滤以匹配提示。
 TS. curves            V->V       Adjust components curves. // 调整组件曲线
 .S. datascope         V->V       Video data analysis. // 视频数据分析。
 TS. dctdnoiz          V->V       Denoise frames using 2D DCT.  // 使用2D-DCT对帧进行去噪。
 TS. deband            V->V       Debands video. // 辩论录像。
 T.. deblock           V->V       Deblock video. // 解除锁定视频。
 ... decimate          N->V       Decimate frames (post field matching filter).  // 抽取帧（后期字段匹配过滤器）。
 TS. deconvolve        VV->V      Deconvolve first video stream with second video stream. // 用第二视频流解卷第一视频流。
 TS. dedot             V->V       Reduce cross-luminance and cross-color.  // 降低交叉亮度和交叉颜色。
 TS. deflate           V->V       Apply deflate effect.  // 应用放气效果。
 ... deflicker         V->V       Remove temporal frame luminance variations.  // 移除时间帧亮度变化。
 ... dejudder          V->V       Remove judder produced by pullup.  // 去除拉起产生的抖动。
 T.. delogo            V->V       Remove logo from input video.  // 从输入视频中删除徽标。
 T.. derain            V->V       Apply derain filter to the input. 在输入端加上减额滤波器。
 ... deshake           V->V       Stabilize shaky video. // 稳定不稳定的视频。
 TS. despill           V->V       Despill video. // 视频系统。
 ... detelecine        V->V       Apply an inverse telecine pattern. // 应用相反的电视电影模式。
 TS. dilation          V->V       Apply dilation effect. // 应用扩张效果。
 T.. displace          VVV->V     Displace pixels.
 ... doubleweave       V->V       Weave input video fields into double number of frames.
 T.. drawbox           V->V       Draw a colored box on the input video.
 ... drawgraph         V->V       Draw a graph using input video metadata.
 T.. drawgrid          V->V       Draw a colored grid on the input video.
 T.C drawtext          V->V       Draw text on top of video frames using libfreetype library.
 T.. edgedetect        V->V       Detect and draw edge.
 ... elbg              V->V       Apply posterize effect, using the ELBG algorithm.
 T.. entropy           V->V       Measure video frames entropy.
 T.C eq                V->V       Adjust brightness, contrast, gamma, and saturation.
 TS. erosion           V->V       Apply erosion effect.
 ... extractplanes     V->N       Extract planes as grayscale frames.
 .S. fade              V->V       Fade in/out input video.
 T.. fftdnoiz          V->V       Denoise frames using 3D FFT.
 T.. fftfilt           V->V       Apply arbitrary expressions to pixels in frequency domain.
 ... field             V->V       Extract a field from the input video.
 ... fieldhint         V->V       Field matching using hints.
 ... fieldmatch        N->V       Field matching for inverse telecine.
 T.. fieldorder        V->V       Set the field order.
 T.. fillborders       V->V       Fill borders of the input video.
 ... find_rect         V->V       Find a user specified object.
 T.. floodfill         V->V       Fill area with same color with another color.
 ... format            V->V       Convert the input video to one of the specified pixel formats.
 ... fps               V->V       Force constant framerate.
 ... framepack         VV->V      Generate a frame packed stereoscopic video.
 .S. framerate         V->V       Upsamples or downsamples progressive source between specified frame rates.
 T.. framestep         V->V       Select one frame every N frames.
 ... freezedetect      V->V       Detects frozen video input.
 ... frei0r            V->V       Apply a frei0r effect.
 T.. fspp              V->V       Apply Fast Simple Post-processing filter.
 TS. gblur             V->V       Apply Gaussian Blur filter.
 TS. geq               V->V       Apply generic equation to each pixel.
 T.. gradfun           V->V       Debands video quickly using gradients.
 ... graphmonitor      V->V       Show various filtergraph stats.
 TS. greyedge          V->V       Estimates scene illumination by grey edge assumption.
 TS. haldclut          VV->V      Adjust colors using a Hald CLUT.
 TS. hflip             V->V       Horizontally flip the input video.
 T.. histeq            V->V       Apply global color histogram equalization.
 ... histogram         V->V       Compute and draw a histogram.
 T.. hqdn3d            V->V       Apply a High Quality 3D Denoiser.
 .S. hqx               V->V       Scale the input by 2, 3 or 4 using the hq*x magnification algorithm.
 ... hstack            N->V       Stack video inputs horizontally.
 T.C hue               V->V       Adjust the hue and saturation of the input video.
 ... hwdownload        V->V       Download a hardware frame to a normal frame
 ... hwmap             V->V       Map hardware frames
 ... hwupload          V->V       Upload a normal frame to a hardware frame
 T.. hysteresis        VV->V      Grow first stream into second stream by connecting components.
 ... idet              V->V       Interlace detect Filter.
 T.. il                V->V       Deinterleave or interleave fields.
 TS. inflate           V->V       Apply inflate effect.
 ... interlace         V->V       Convert progressive video into interlaced.
 ... interleave        N->V       Temporally interleave video inputs.
 ... kerndeint         V->V       Apply kernel deinterlacing to the input.
 .S. lagfun            V->V       Slowly update darker pixels.
 .S. lenscorrection    V->V       Rectify the image by correcting for lens distortion. // 通过校正镜头失真来校正图像。
 TS. limiter           V->V       Limit pixels components to the specified range.
 ... loop              V->V       Loop video frames. // 循环视频帧。
 TS. lumakey           V->V       Turns a certain luma into transparency.
 TS. lut               V->V       Compute and apply a lookup table to the RGB/YUV input video.
 TS. lut1d             V->V       Adjust colors using a 1D LUT.
 TS. lut2              VV->V      Compute and apply a lookup table from two video inputs. // 从两个视频输入计算并应用查找表。
 TS. lut3d             V->V       Adjust colors using a 3D LUT.
 TS. lutrgb            V->V       Compute and apply a lookup table to the RGB input video.
 TS. lutyuv            V->V       Compute and apply a lookup table to the YUV input video.
 TS. maskedclamp       VVV->V     Clamp first stream with second stream and third stream. // 用第二流和第三流夹住第一流。
 TS. maskedmerge       VVV->V     Merge first stream with second stream using third stream as mask. // 使用第三流作为掩码将第一流与第二流合并
 TS. maskfun           V->V       Create Mask.
 ... mcdeint           V->V       Apply motion compensating deinterlacing.
 ... mergeplanes       N->V       Merge planes.
 ... mestimate         V->V       Generate motion vectors.
 T.. metadata          V->V       Manipulate video frame metadata.
 T.. midequalizer      VV->V      Apply Midway Equalization.
 ... minterpolate      V->V       Frame rate conversion using Motion Interpolation.
 .S. mix               N->V       Mix video inputs.
 ... mpdecimate        V->V       Remove near-duplicate frames.
 TS. negate            V->V       Negate input video.  // 否定输入视频。
 TS. nlmeans           V->V       Non-local means denoiser.
 T.. nnedi             V->V       Apply neural network edge directed interpolation intra-only deinterlacer.
 ... noformat          V->V       Force libavfilter not to use any of the specified pixel formats for the input to the next filter.
 TS. noise             V->V       Add noise.
 T.. normalize         V->V       Normalize RGB video.  // 标准化RGB视频
 ... null              V->V       Pass the source unchanged to the output.
 ... ocr               V->V       Optical Character Recognition.
 T.. oscilloscope      V->V       2D Video Oscilloscope.
 TSC overlay           VV->V      Overlay a video source on top of the input.  // 在输入端覆盖视频源
 T.. owdenoise         V->V       Denoise using wavelets.
 ... pad               V->V       Pad the input video.  // 把输入的视频垫上
 ... palettegen        V->V       Find the optimal palette for a given stream.
 ... paletteuse        VV->V      Use a palette to downsample an input video stream.  // 使用调色板缩小输入视频流的采样。
 ... perms             V->V       Set permissions for the output video frame.  // 设置输出视频帧的权限。
 TS. perspective       V->V       Correct the perspective of video.  // 纠正视频的透视图。
 T.. phase             V->V       Phase shift fields.
 ... pixdesctest       V->V       Test pixel format definitions.
 T.. pixscope          V->V       Pixel data analysis.
 T.C pp                V->V       Filter video using libpostproc.  // 使用libpostproc过滤视频。
 T.. pp7               V->V       Apply Postprocessing 7 filter.
 TS. premultiply       N->V       PreMultiply first stream with first plane of second stream.
 TS. prewitt           V->V       Apply prewitt operator.
 T.. pseudocolor       V->V       Make pseudocolored video frames.  // 制作假彩色视频帧。
 ... psnr              VV->V      Calculate the PSNR between two video streams. // 计算两个视频流之间的PSNR。
 ... pullup            V->V       Pullup from field sequence to frames.
 T.. qp                V->V       Change video quantization parameters.  // 更改视频量化参数。
 ... random            V->V       Return random frames.
 T.. readeia608        V->V       Read EIA-608 Closed Caption codes from input video and write them to frame metadata.  // 从输入视频中读取EIA-608闭路字幕代码，并将其写入帧元数据。
 ... readvitc          V->V       Read vertical interval timecode and write it to frame metadata.
 ... realtime          V->V       Slow down filtering to match realtime.
 TS. remap             VVV->V     Remap pixels.  // 大括号像素。
 TS. removegrain       V->V       Remove grain.
 T.. removelogo        V->V       Remove a TV logo based on a mask image. // 移除基于遮罩图像的电视徽标
 ... repeatfields      V->V       Hard repeat fields based on MPEG repeat field flag.
 ... reverse           V->V       Reverse a clip.
 TS. rgbashift         V->V       Shift RGBA.
 TS. roberts           V->V       Apply roberts cross operator.
 TSC rotate            V->V       Rotate the input image.  // 旋转输入图像。
 T.. sab               V->V       Apply shape adaptive blur.
 ..C scale             V->V       Scale the input video size and/or convert the image format. // 缩放输入视频大小和/或转换图像格式。
 ..C scale2ref         VV->VV     Scale the input video size and/or convert the image format to the given reference. // 缩放输入视频大小和/或将图像格式转换为给定的参考。
 ... select            V->N       Select video frames to pass in output.  // 选择要传入输出的视频帧。
 TS. selectivecolor    V->V       Apply CMYK adjustments to specific color ranges.
 ... sendcmd           V->V       Send commands to filters.
 ... separatefields    V->V       Split input video frames into fields.  // 将输入的视频帧分割为多个字段。
 ... setdar            V->V       Set the frame display aspect ratio.
 ... setfield          V->V       Force field for the output video frame.  // 输出视频帧的力场。
 ... setparams         V->V       Force field, or color property for the output video frame.  // 输出视频帧的力场或颜色属性。
 ... setpts            V->V       Set PTS for the output video frame.   // 为输出视频帧设置PTS。
 ... setrange          V->V       Force color range for the output video frame.  // 强制输出视频帧的颜色范围。
 ... setsar            V->V       Set the pixel sample aspect ratio.
 ... settb             V->V       Set timebase for the video output link.  // 设置视频输出链接的时基。
 ... showinfo          V->V       Show textual information for each video frame.  // 显示每个视频帧的文本信息。
 T.. showpalette       V->V       Display frame palette.
 T.. shuffleframes     V->V       Shuffle video frames.   // 随机播放视频帧。
 T.. shuffleplanes     V->V       Shuffle video planes.
 T.. sidedata          V->V       Manipulate video frame side data.
 .S. signalstats       V->V       Generate statistics from video analysis.  // 从视频分析生成统计信息。
 ... signature         N->V       Calculate the MPEG-7 video signature  // 计算MPEG-7视频签名
 T.. smartblur         V->V       Blur the input video without impacting the outlines.  // 在不影响轮廓的情况下模糊输入视频。
 TS. sobel             V->V       Apply sobel operator.
 ... split             V->N       Pass on the input to N video outputs.  // 将输入传给N个视频输出。
 T.C spp               V->V       Apply a simple post processing filter.
 T.. sr                V->V       Apply DNN-based image super resolution to the input. // 对输入应用基于DNN的图像超分辨率。
 ... ssim              VV->V      Calculate the SSIM between two video streams.  // 计算两个视频流之间的SSIM。
 .S. stereo3d          V->V       Convert video stereoscopic 3D view.  // 转换视频立体三维视图。
 ..C streamselect      N->N       Select video streams  // 选择视频流
 ... subtitles         V->V       Render text subtitles onto input video using the libass library.
 ... super2xsai        V->V       Scale the input by 2x using the Super2xSaI pixel art algorithm.
 T.. swaprect          V->V       Swap 2 rectangular objects in video.  // 换视频中的两个矩形对象。
 T.. swapuv            V->V       Swap U and V components.
 TS. tblend            V->V       Blend successive frames.
 ... telecine          V->V       Apply a telecine pattern.
 TS. threshold         VVVV->V    Threshold first video stream using other video streams.  // 使用其他视频流的阈值第一视频流。
 ... thumbnail         V->V       Select the most representative frame in a given sequence of consecutive frames.
 ... tile              V->V       Tile several successive frames together.
 ... tinterlace        V->V       Perform temporal field interlacing.
 TS. tlut2             V->V       Compute and apply a lookup table from two successive frames.
 TS. tmix              V->V       Mix successive video frames.  // 混合连续的视频帧。
 .S. tonemap           V->V       Conversion to/from different dynamic ranges.
 ... tpad              V->V       Temporarily pad video frames.  // 临时填充视频帧。
 .S. transpose         V->V       Transpose input video.  // 转置输入视频。
 ... trim              V->V       Pick one continuous section from the input, drop the rest.
 TS. unpremultiply     N->V       UnPreMultiply first stream with first plane of second stream.
 TS. unsharp           V->V       Sharpen or blur the input video.  // 锐化或模糊输入视频
 T.. uspp              V->V       Apply Ultra Simple / Slow Post-processing filter.
 T.. vaguedenoiser     V->V       Apply a Wavelet based Denoiser.
 ... vectorscope       V->V       Video vectorscope.
 T.. vflip             V->V       Flip the input video vertically.  // 垂直翻转输入视频。
 ... vfrdet            V->V       Variable frame rate detect filter.
 TS. vibrance          V->V       Boost or alter saturation.
 ... vidstabdetect     V->V       Extract relative transformations, pass 1 of 2 for stabilization (see vidstabtransform for pass 2).
 ... vidstabtransform  V->V       Transform the frames, pass 2 of 2 for stabilization (see vidstabdetect for pass 1).
 T.. vignette          V->V       Make or reverse a vignette effect.
 ... vmafmotion        V->V       Calculate the VMAF Motion score.
 ... vstack            N->V       Stack video inputs vertically.  // 垂直堆叠视频输入。
 TS. w3fdif            V->V       Apply Martin Weston three field deinterlace.
 .S. waveform          V->V       Video waveform monitor.
 ... weave             V->V       Weave input video fields into frames.  // 将输入的视频字段编织成帧。
 .S. xbr               V->V       Scale the input using xBR algorithm.
 .S. xmedian           N->V       Pick median pixels from several video inputs. // 从多个视频输入中选取中值像素。
 ... xstack            N->V       Stack video inputs into custom layout.  // 将视频输入堆叠到自定义布局中。
 TS. yadif             V->V       Deinterlace the input image. // 取消输入图像的隔行扫描。
 ... zoompan           V->V       Apply Zoom & Pan effect.
 ... allrgb            |->V       Generate all RGB colors.
 ... allyuv            |->V       Generate all yuv colors.
 ... cellauto          |->V       Create pattern generated by an elementary cellular automaton.
 ..C color             |->V       Provide an uniformly colored input.
 ... coreimagesrc      |->V       Video source using image generators of CoreImage API. // 使用CoreImage API的图像生成器的视频源。
 ... frei0r_src        |->V       Generate a frei0r source.
 ... haldclutsrc       |->V       Provide an identity Hald CLUT.
 ... life              |->V       Create life.
 ... mandelbrot        |->V       Render a Mandelbrot fractal.
 ... mptestsrc         |->V       Generate various test pattern.
 ... nullsrc           |->V       Null video source, return unprocessed video frames.  // 空视频源，返回未处理的视频帧。
 ... pal75bars         |->V       Generate PAL 75% color bars.
 ... pal100bars        |->V       Generate PAL 100% color bars.
 ... rgbtestsrc        |->V       Generate RGB test pattern.
 ... smptebars         |->V       Generate SMPTE color bars.
 ... smptehdbars       |->V       Generate SMPTE HD color bars.
 ... testsrc           |->V       Generate test pattern.
 ... testsrc2          |->V       Generate another test pattern.
 ... yuvtestsrc        |->V       Generate YUV test pattern.
 ... nullsink          V->|       Do absolutely nothing with the input video.  // 对输入的视频绝对不要做任何事情。
 ... abitscope         A->V       Convert input audio to audio bit scope video output.  // 将输入音频转换为音频位范围视频输出。
 ... adrawgraph        A->V       Draw a graph using input audio metadata.
 ... agraphmonitor     A->V       Show various filtergraph stats.
 ... ahistogram        A->V       Convert input audio to histogram video output.  // 将输入音频转换为直方图视频输出。
 ... aphasemeter       A->N       Convert input audio to phase meter video output.  // 将输入音频转换为相位计视频输出。
 ... avectorscope      A->V       Convert input audio to vectorscope video output.  // 将输入音频转换为矢量示波器视频输出。
 ..C concat            N->N       Concatenate audio and video streams.  // 连接音频和视频流。
 ... showcqt           A->V       Convert input audio to a CQT (Constant/Clamped Q Transform) spectrum video output.  // 将输入音频转换为CQT（恒定/钳制Q变换）频谱视频输出。
 ... showfreqs         A->V       Convert input audio to a frequencies video output.  // 将输入音频转换为频率视频输出。
 .S. showspatial       A->V       Convert input audio to a spatial video output.  // 将输入音频转换为空间视频输出。
 .S. showspectrum      A->V       Convert input audio to a spectrum video output.  // 将输入音频转换为频谱视频输出。
 .S. showspectrumpic   A->V       Convert input audio to a spectrum video output single picture.  // 将输入音频转换为频谱视频输出单个图片。
 ... showvolume        A->V       Convert input audio volume to video output.  // 输入音频音量转换为视频输出。
 ... showwaves         A->V       Convert input audio to a video output.  // 将输入音频转换为视频输出。
 ... showwavespic      A->V       Convert input audio to a video output single picture.  // 将输入音频转换为视频输出单个图片。
 ... spectrumsynth     VV->A      Convert input spectrum videos to audio output. // 将输入频谱视频转换为音频输出。
 ..C amovie            |->N       Read audio from a movie source.
 ..C movie             |->N       Read from a movie source.
 ... afifo             A->A       Buffer input frames and send them when they are requested.
 ... fifo              V->V       Buffer input images and send them when they are requested.
 ... abuffer           |->A       Buffer audio frames, and make them accessible to the filterchain.
 ... buffer            |->V       Buffer video frames, and make them accessible to the filterchain.  // 缓冲视频帧，并使其可被过滤器链访问。
 ... abuffersink       A->|       Buffer audio frames, and make them available to the end of the filter graph.  // 缓冲音频帧，并使它们在过滤图的末尾可用。
 ... buffersink        V->|       Buffer video frames, and make them available to the end of the filter graph. // 缓冲视频帧，并使它们在过滤图的末尾可用。
```



