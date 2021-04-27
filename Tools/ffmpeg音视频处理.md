# ffmpeg音视频处理

## 去除音视频中的视频

```
ffmpeg -i ./1573535886182365.mp4 -map 0:0 -vcodec copy out.mp4
```

## 去除音视频中的音频

```
ffmpeg -i 1573535886182365.mp4 -vcodec copy -an 2.mp4
```
## 视频拼接

mpg拼接（问题：拼接成功但只显示第一个）
```
ffmpeg -i "concat:video1.mpg|video2.mpg" -c copy output.mpg
```

拼接视频不一致的格式时，需要转码

例子：
```
ffmpeg -i out11.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts intermediate1.ts

ffmpeg -i 2.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts intermediate2.ts

ffmpeg -i "concat:intermediate1.ts|intermediate2.ts" -c copy -bsf:a aac_adtstoasc output.mp4
```

# 截取音频

```
ffmpeg -i out.mp4 -ss 00:10 -t 00:40 -acodec copy out1.mp4
```

## 将图片转换成视频
1. 生成.mpg
```
ffmpeg -i image%3d.jpeg output.mpg
```
或
```
ffmpeg -f image2 -i image00%d.jpeg video.mpg
```
2. 生成.mp4

简单的生成
```
ffmpeg -i image%3d.jpeg -pix_fmt yuv420p a.mp4
```
-pix_fmt yuv420p


设定参数
```
ffmpeg -r 25 -loop 1 -i image%3d.jpeg -pix_fmt yuv420p -vcodec libx264 -b:v 600k -r:v 25 -preset medium -crf 30 -s 720x576 -vframes 250 -r 25 -t 3 a.mp4
```

# 将多张图片合成视频

1. 带音频合成：

```
ffmpeg -threads 2 -y -r 1 -i image%3d.jpeg  -i audio.wav -pix_fmt yuv420p image.mp4
```

- -threads 2: 以两个县城进行运行，加快处理的速度
- -y: 对输出文件进行覆盖
- -r 10: fps设置为10帧/妙
- -absf aac_adtstoasc：编码音频格式，使之能在一些设备上能播放
1. 不带音频合成

```
ffmpeg -loop 1 -f image2 -i image%3d.jpeg -pix_fmt yuv420p -vcodec libx264 -r 10 -t 10 output.mp4
```


## 将一张图片做成视频封面
```
ffmpeg -i 2.mp4 -i image1.png -map 0 -map 1 -c copy -c:v:1 png -disposition:v:1 attached_pic output_video.mp4
```
## 在特定的时间显示图片

在0～5秒内显示图片,图片的x坐标为60，否则为-500(移出屏幕)，y坐标一直为50不变
```
ffmpeg -y -i 1573535886182365.mp4 -i t016e3f183704154203.jpg -filter_complex "overlay=x='if(between(t,0,5),0,-5000)':y=0" -f mp4 left3.mp4
```
## 音频提前或延迟N秒
```
ffmpeg -i 1573535886182365.mp4 -filter_complex "adelay=3000|3000" revideo.mp4
```

## 合并音频视频或替换音频流
如果输入的视频已经包含音频，并且想要替换它，需要告诉ffmpeg采取哪个音频流：
```
ffmpeg -i output1.mp4 -i out.mp4  \-c:v copy -c:a aac -strict experimental \-map 0:v:0 -map  1:a:0 output2.mp4
```

## 合并音频和视频，给音频重新编码
在这里，我们假定视频文件没有包含任何音频流，并且希望具有与输入格式相同的输出格式(此处为MP4)。

上述命令转码音频，因为MP4不能携带PCM音频流。如果需要，可以使用任何其他所需的音频编解码器

```
ffmpeg -i out.mp4 -i 2.mp4 \-c:v copy -c:a aac -strict experimental output.mp4
```

## 实例
1. 视频去除音频

```
ffmpeg -i v4.mp4 -vcodec copy -an dv2.mp4

ffmpeg -i v3.mp4 -vcodec copy -an dv1.mp4
```
- -i : filename输入文件
- -vcodec：vcodec是 -codec:v的一个别称，强制使用codec 编解码方式，未设定时使用与输入流相同的编码器。如果用copy表示原始编解码数据必须被拷贝
- -an: 不使用音频记录

1. 拼接视频

```
ffmpeg -i dv1.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts intermediate1.ts


ffmpeg -i dv2.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts intermediate2.ts


ffmpeg -i "concat:intermediate1.ts|intermediate2.ts" -c:a copy -bsf:a aac_adtstoasc dv12.mp4
```

- -c[:stream_specifier] codec (input/output, per-stream)

3. 插入封面图片

```
ffmpeg -i dv12.mp4 -i image1.png -map 0 -map 1 -c copy -c:v:1 png -disposition:v:1 attached_pic idv12.mp4
```

4. 合成音频

```
ffmpeg -i idv12.mp4  -i audio.wav \-c:v copy -c:a aac -strict experimental chen.mp4
```

## 管道pipe

```
ffmpeg -f image2 -loop 1 -i img.jpg \
       -f s16le -ac 1 -ar 16k -i wd.pcm -t 6 \
       -f nut pipe: | \
ffmpeg -i audio.mp3 \
       -i pipe: -i 1.mp4 \
       -i 2.mp4 -i 3.mp4 \
       -i 4.mp4 \
	-filter_complex '[1:v]scale=720:1280[in1];
                   [2:v]scale=720:1280[in2];
                   [3:v]scale=720:1280[in3];
                   [4:v]scale=720:1280[in4];
                   [5:v]scale=720:1280[in5];
                   [in1][in2][in3][in4][in5] concat=n=5:v=1:a=0 [v];
                   [0:a][1:a] amix=inputs=2 [a]' \
	-map '[v]' -map '[a]' -c:v libx264 -t 30 -f nut pipe: | \
ffmpeg -i pipe: -i f.jpg \
       -map 0 -map 1 -c:v libx264 -c:a aac -c:v:1 png -disposition:v:1 attached_pic result.mp4

```


相关资料：
- [官网](http://ffmpeg.org/ffmpeg-all.html#Expression-Evaluation)
- [https://vimsky.com/article/3687.html](https://vimsky.com/article/3687.html)
- [https://www.longqi.cf/tools/2015/02/13/ffmpegcn/](https://www.longqi.cf/tools/2015/02/13/ffmpegcn/)
- [http://einverne.github.io/post/2015/12/ffmpeg-first.html#ffmpeg-usage](http://einverne.github.io/post/2015/12/ffmpeg-first.html#ffmpeg-usage)
- [https://www.twblogs.net/a/5c9a26bfbd9eee434fc6c81b/zh-cn](https://www.twblogs.net/a/5c9a26bfbd9eee434fc6c81b/zh-cn)
- [https://wklchris.github.io/FFmpeg.html#%E8%A7%86%E9%A2%91%E5%8F%82%E6%95%B0](https://wklchris.github.io/FFmpeg.html#%E8%A7%86%E9%A2%91%E5%8F%82%E6%95%B0)
- [https://github.com/tonydeng/fmj/blob/master/ffmpeg.md#%e6%b7%bb%e5%8a%a0%e5%ad%97%e5%b9%95](https://github.com/tonydeng/fmj/blob/master/ffmpeg.md#%e6%b7%bb%e5%8a%a0%e5%ad%97%e5%b9%95)
- [https://www.ancii.com/arzmnzdzz/](https://www.ancii.com/arzmnzdzz/)
- [https://www.jianshu.com/p/d6480c6ea6bd](https://www.jianshu.com/p/d6480c6ea6bd)
- [http://trac.ffmpeg.org/wiki/Concatenate](http://trac.ffmpeg.org/wiki/Concatenate)
- [https://www.linmao.dev/joy/868/#i-3](https://www.linmao.dev/joy/868/#i-3)

