# 移动端适配1px的问题

移动项目中的边框全部都变粗了

## 造成边框变粗的原因

其实这个原因很简单，因为CSS中的1px并不等于欧移动设备的1px，这些由于不同的手机有不同的像素密度。在window对象中有一个`devicePixelRatio`属性，它可以反应CSS中的像素与设备像素

> devicePixelRatio的官方定义为：设备无力橡树和设备独立像素的比例，也就是devicePixelRatio=物理像素/独立像素

以iPhone6为例

iPhone6的屏幕宽度为375px，设计师做的**视觉稿**一般是750px,也就是2px，这个时候设计师在**视觉稿**上画了1px的边框，于是你就写了“border-width:1px”，所以，1px边框问题产生了

对设计师来说它的1px是相对于750px的（物理像素），对你来说你的1px是相对于375px的（css像素）“**实际上你应该是border-width:0.5px”。**

## 解决边框变粗的6种办法

### 1. 0.5px边框

在2014年的WWDC，“设计响应的Web体验”一讲中，，Ted O’Connor 讲到关于“retinahairlines”（retina 极细的线）：在retina屏上仅仅显示1物理像素的边框，开发者应该如何处理呢。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-23-%E8%9A%82%E8%9A%81%E5%89%8D%E7%AB%AF%E7%A0%94%E5%8F%91%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5_%E6%88%90%E9%83%BD%E5%85%A8%E6%A0%88%E5%A4%A7%E4%BC%9A)


0.5px边框

问题是 retina 屏的浏览器可能不认识0.5px的边框，将会把它解释成0px，没有边框。包括 iOS 7 和之前版本，OS X Mavericks 及以前版本，还有 Android 设备。

**解决方案：**

### 用小数点写边框

媒体查询，加小数点的写法：

```css
.border { border: 1px solid #999 }
@media screen and (-webkit-min-device-pixel-ratio: 2) {
    .border { border: 0.5px solid #999 }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
    .border { border: 0.333333px solid #999 }
}
```
优点：方便噻
缺点: 安卓与低版本IOS不适用, 这个或许是未来的标准写法

### 2. 使用border-image实现

弄出1px像素边框的实质是弄出0.5px这样的边框，所以我们可以利用类似于这样的图片，使得“border-image-slice”为2，那么实际上边框有一半是透明的，即可得到我们想要的“1px边框”

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-23-163542bd9cebc824)

```html
<div class="test">
    1像素边框
</div>

```

```css
.test{
    border: 1px solid transparent;
    border-image: url('./border-1px.png') 2 repeat;
}
```

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-23-1635433ddb7e6af4)

- 修改颜色麻烦, 需要替换图片
- 圆角需要特殊处理，并且边缘会模糊

### 3. 使用background-image实现

background-image 跟border-image的方法一样，你要先准备一张符合你要求的图片。然后将边框模拟在背景上。
样式设置：

```css
.background-image-1px {
background: url(../img/line.png) repeat-x left bottom;
-webkit-background-size: 100% 1px;
background-size: 100% 1px;
}
```
优点：

缺点：

修改颜色麻烦, 需要替换图片
圆角需要特殊处理，并且边缘会模糊

### 4. 多背景渐变实现

与background-image方案类似，只是将图片替换为css3渐变。设置1px的渐变背景，50%有颜色，50%透明。
样式设置：

```css
.background-gradient-1px {
background:
linear-gradient(180deg, black, black 50%, transparent 50%) top left / 100% 1px no-repeat,
linear-gradient(90deg, black, black 50%, transparent 50%) top right / 1px 100% no-repeat,
linear-gradient(0, black, black 50%, transparent 50%) bottom right / 100% 1px no-repeat,
linear-gradient(-90deg, black, black 50%, transparent 50%) bottom left / 1px 100% no-repeat;
}
/* 或者 */
.background-gradient-1px{
background: -webkit-gradient(linear, left top, left bottom, color-stop(.5, transparent), color-stop(.5, #c8c7cc), to(#c8c7cc)) left bottom repeat-x;
background-size: 100% 1px;
}
```

优点：

缺点：

### 5. 使用box-shadow模拟边框

利用css 对阴影处理的方式实现0.5px的效果

```css
.box-shadow-1px {
box-shadow: inset 0px -1px 1px -1px #c8c7cc;
}
```

优点：

缺点：

### 6. viewport + rem 实现

同时通过设置对应`viewport`的`rem`基准值，这种方式就可以像以前一样轻松愉快的写1px了。
在devicePixelRatio = 2 时，输出viewport：


这种兼容方案相对比较完美，适合新的项目，老的项目修改成本过大。
对于这种方案，可以看看[https://github.com/amfe/article/issues/17](https://github.com/amfe/article/issues/17)

优点：

缺点：

### 7. 伪类 + transform实现

利用伪类标签，更具父级定位，大小更具**媒体查询**缩放实现效果（注意别忘记了“**transform-origin: left top**;”）

```html
<span class="border-1px">1像素边框问题</span>
```

```less
// less
.border-1px{
  position: relative;
  &::before{
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    border:1px solid red;
    color: red;
    height: 200%;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    pointer-events: none; /* 防止点击触发 */
    box-sizing: border-box;
    @media screen and (min-device-pixel-ratio:3),(-webkit-min-device-pixel-ratio:3){
      width: 300%;
      height: 300%;
      -webkit-transform: scale(0.33);
      transform: scale(0.33);
    }
  }
}

```

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-23-163487345f17f3d4)

> 需要注意的input button是没有:before,:after伪元素的
> - 优点： 其实不止是圆角，其他的边框也可以这样做出来
> - 缺点： 代码量也很大，占据了伪元素，容易引起冲突


### 8. boder-shadow

利用阴影来模拟边框

```css
.border-1px{
  box-shadow: 0px 0px 1px 0px red inset;
}
```
2倍屏
![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-23-104841.jpg)

3倍屏幕
![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-23-163487e1ced2e2d7-1)


## 总结

从兼容性和灵活性来考虑，个人还是推荐tranform加伪类标签的写法，节约时间成本。