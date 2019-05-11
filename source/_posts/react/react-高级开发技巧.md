---
title: react-高级开发技巧
date: 2019-05-08 13:52:02
tags: react 前端
---

# React和第三方库

## 1. React中npm包：命令、包管理流程

![第三方库](../../../public/images/react_high_1.1.1.png)

**fetch、 axios**

![npm命令](../../../public/images/react_high_1.1.2.png)

![包管理工具](../../../public/images/react_high_1.1.3.png)


![包管理流程](../../../public/images/react_high_1.1.4.png)

## 2. 主流开发包：moment.js

![](../../../public/images/react_high_1.2.1.png)

纯lib插件：不涉及任何UI

时间格式

引入：
```
import moment from 'moment'
// 放到全局，外部也可以使用
window.moment = moment
```
![](../../../public/images/react_high_1.2.2.png)

![](../../../public/images/react_high_1.2.3.png)

标准格式
```
moment('2018-09-22', 'YYYY-MM-DD')
```

![](../../../public/images/react_high_1.2.4.png)

![初始化](../../../public/images/react_high_1.2.5.png)

![show](../../../public/images/react_high_1.2.6.png)

![time](../../../public/images/react_high_1.2.7.png)

```
import moment from 'moment'
// 里面的字符可以根据自己的需要进行调整
moment.locale('zh-cn', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY-MM-DD',
        LL: 'YYYY年MM月DD日',
        LLL: 'YYYY年MM月DD日Ah点mm分',
        LLLL: 'YYYY年MM月DD日ddddAh点mm分',
        l: 'YYYY-M-D',
        ll: 'YYYY年M月D日',
        lll: 'YYYY年M月D日 HH:mm',
        llll: 'YYYY年M月D日dddd HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === '凌晨' || meridiem === '早上' ||
            meridiem === '上午') {
            return hour;
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
        } else {
            // '中午'
            return hour >= 11 ? hour : hour + 12;
        }
    },
    meridiem: function (hour, minute, isLower) {
        const hm = hour * 100 + minute;
        if (hm < 600) {
            return '凌晨';
        } else if (hm < 900) {
            return '早上';
        } else if (hm < 1130) {
            return '上午';
        } else if (hm < 1230) {
            return '中午';
        } else if (hm < 1800) {
            return '下午';
        } else {
            return '晚上';
        }
    },
    calendar: {
        sameDay: '[今天]LT',
        nextDay: '[明天]LT',
        nextWeek: '[下]ddddLT',
        lastDay: '[昨天]LT',
        lastWeek: '[上]ddddLT',
        sameElse: 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            case 'M':
                return number + '月';
            case 'w':
            case 'W':
                return number + '周';
            default:
                return number;
        }
    },
    relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '几秒',
        ss: '%d秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年'
    },
    week: {
        // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
        dow: 1, // Monday is the first day of the week.
        doy: 4  // The week that contains Jan 4th is the first week of the year.
    }
})
```

![time](../../../public/images/react_high_1.2.8.png)

![op](../../../public/images/react_high_1.2.8.png)

```
// 当前时间减一秒
moment().subtarct(1, 's')
```

## 3. React头像插件-安装、头像、实践处理

![头像编辑器插件](../../../public/images/react_high_1.3.1.png)

![头像编辑器示例](../../../public/images/react_high_1.3.2.png)

![图片后续处理](../../../public/images/react_high_1.3.3.png)

![图片后续处理示例](../../../public/images/react_high_1.3.4.png)

## 4. React和jQuery及$.ajax

![安装](../../../public/images/react_high_1.4.1.png)

![node](../../../public/images/react_high_1.4.2.png)

jQuery的ajax

jQuery对ajax的封装是非常简单易用的

![node](../../../public/images/react_high_1.4.3.png)

this作用域丢失，改用箭头函数

![node](../../../public/images/react_high_1.4.4.png)


## 5. fetch和axios完全解析

![fetch](../../../public/images/react_high_1.5.1.png)

![fetch](../../../public/images/react_high_1.5.2.png)

**前面带问号表示可传可不传**
**要定义credentials才可以发送cookie，**

![fetchUrl](../../../public/images/react_high_1.5.3.png)

![fetchRequest](../../../public/images/react_high_1.5.4.png)

![fetchHeader](../../../public/images/react_high_1.5.5.png)

![fetchResponse](../../../public/images/react_high_1.5.6.png)

![vs](../../../public/images/react_high_1.5.7.png)

![axios](../../../public/images/react_high_1.5.8.png)

![axios](../../../public/images/react_high_1.5.9.png)

![axios](../../../public/images/react_high_1.5.0.png)

![axiosEg](../../../public/images/
react_high_1.5.11.png)

![axiosEg](../../../public/images/react_high_1.5.12.png)

```
const myAxios = axios.create({
  baseUrl = 'http://jsonplaceholder.typicode.com',
  headers: {
    'content-type': 'application/json'
  },
  // 请求前处理数据
  <!-- transformRequest: [
    data=> {
      console.log(data);
      data.userId = 1
      return JSON.stringify(data)
    }
  ] -->
  // 对响应的数据进行处理
  <!-- transformResponse: [
    res=> {
      return JSON.parse(res);
    }
  ] -->
})

// 请求前拦截修改配置
myAxios.intercepors.request.use(
  config=> {
    console.log(config);
    config.headers['x-powered-by'] = 'axios'
  }
)

// 响应拦截修改
myAxios.intercepors.response.use(
  res => {
    return res.data
  }
)

myAxios.get('/todos', {})
.then(res => {    // 如果有响应拦截，则此处接收是data
  console.log()
}).catch(err=> {
  console.error()
})
```

![总结](../../../public/images/react_high_1.5.13.png)

# React开发、测试和打包

## 1.【开发篇】非受控表单和ref

![ref](../../../public/images/react_high_2.1.1.png)

```
<Input
  ref = {node => {
    console.log(node);
    this.input = node
  }}
/>
```

## 2.【开发篇】React中的innerHTML

![innerHTML](../../../public/images/react_high_2.2.1.png)

```
state = {
  html: '<div>Markdown</div>'
}
```
![innerHTML](../../../public/images/react_high_2.2.2.png)

```
<div
  dangerouslySetInnerHTML = {
    {
      __html: this.state.html
    }
  }
></div>
```

## 3.【开发篇】不使用jsx语法糖开发

![](../../../public/images/react_high_2.3.1.png)

```
<div id='d1' onClick={e=>window.alert('jsx')}>
  你好！我是来自jsx
</div>

// 不使用jsx(实则是jsx编译后的)
React.createElement (
  'div',
  {
    id: "d1",
    onClick: (e) => {
      window.alert('create element')
    }
  },
  你好！我是来自create element
)
```

## 4.【开发篇】使用ES5开发React组件

![](../../../public/images/react_high_2.4.1.png)

## 5.【测试篇】enzyme测试框架、浅层、DOM

简单的测试App.test.js
![](../../../public/images/react_high_2.5.1.png)

![测试方法/工具](../../../public/images/react_high_2.5.2.png)

![安装enzyme](../../../public/images/react_high_2.5.3.png)

![运行测试](../../../public/images/react_high_2.5.4.png)

![浅层渲染](../../../public/images/react_high_2.5.5.png)

## 6.【测试篇】todo-list四个完全测试示例

## 7.【打包篇】React项目打包以及Node发布

![React开发示意图](../../../public/images/react_high_2.7.1.png)

![打包命令和文件夹解析](../../../public/images/react_high_2.7.2.png)

![使用nodejs架设react应用](../../../public/images/react_high_2.7.3.png)

## 总结

![本课小结](../../../public/images/react_high_2.png)

# React UI库入门-React-Bootstrap

## 1. React-Bootstrap安装、样式引用和基本组件

![](../../../public/images/react_high_3.1.1.png)

![](../../../public/images/react_high_3.1.2.png)

```
import {
  Alert,
  } from 'react-bootstrap'
<div classname="App">
  <Alert></Alert>
</div>
```

## 2. React-Bootstrap栅格系统和API解读

## 3. React-Bootstrap重新构建TodoList

## 4. React-Bootstrap交互组件和过渡组件详解

![](../../../public/images/react_high_3.4.1.png)
