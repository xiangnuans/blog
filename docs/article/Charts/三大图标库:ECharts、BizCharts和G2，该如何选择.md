阿里开源的BizCharts图标哭库基于React技术栈，各个图表项皆采用了组件的形式，贴近React的使用特点。同时BizCharts基于G2进行封装，BizCharts也继承了G2相关特性。公司目前同意使用的是ECharts图表库， 下文对3种图标库进行分析对比

# BizCharts

官网地址：[BizCharts](https://bizcharts.net/products/bizCharts/api/bizcharts)

## 一、安装

通过npm/yarn 引入

```
npm install bizcharts --save

yarn add bizcharts  --save

```

## 二、引用

成功安装完成之后，即可使用import或require进行引用。
例子：
```
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import chartConfig from './assets/js/chartConfig';

```

## 三、DataSet

BizCharts中可以通过dataset（数据处理模块）来对图标数据进行处理，该方法继承自G2，在下文中将对此进行详细分析。

# G2

BizCharts基于G2进行开发，在研究BizCharts的过程中页一起对G2进行了实践

## 一、安装
和BizCharts一样，可以通过npm/yarn 引入

```
npm install @antv/g2 --save

yarn add @antv/g2 --save

```

与BizCharts不同，G2初始化数据并非以组件的形式引入，而是需要获取在某个DOM下初始化图表。获取该DOM的唯一属性ID之后，通过chart()进行初始化。

## 引用
示例：

```
import React from 'react';
import G2 from '@antv/g2';
    class g2 extends React.Component {constructor(props) {
	    super(props);
	    this.state = {
	      data :[
	        { genre: 'Sports', sold: 275 },
	        { genre: 'Strategy', sold: 115 },
	        { genre: 'Action', sold: 120 },
	        { genre: 'Shooter', sold: 350 },
	        { genre: 'Other', sold: 150 }
	      ]
	    };
    }

    componentDidMount() {
	    const chart = new G2.Chart({
	      container: 'c1', // 指定图表容器 ID
	      width: 600, // 指定图表宽度
	      height: 300 // 指定图表高度
	    });
	    chart.source(this.state.data);
	    chart.interval().position('genre*sold').color('genre');
	    chart.render();
    }
    render() {
	    return (
	      <div id="c1" className="charts">
	      </div>
	    );
	}
}
export default g2;

```

## 三、DataSet

DataSet主要有两方面的功能，解析数据（Connector）&加工数据（Transform）。官方文档描述得比较详细，可以参考官网的分类：

源数据的解析，将csv, dsv,geojson 转成标准的JSON，查看Connector
加工数据，包括 filter,map,fold(补数据) 等操作，查看Transform
统计函数，汇总统计、百分比、封箱 等统计函数，查看 Transform
特殊数据处理，包括 地理数据、矩形树图、桑基图、文字云 的数据处理，查看 Transform

# ECharts

ECharts是一个成熟的图表库，使用方便、图表种类多、容易上手。文档资源页比较丰富。[ECharts文档](https://link.juejin.im/?target=http%3A%2F%2Fecharts.baidu.com%2F)

ECharts & BizCharts & G2对比

对比BizCharts和G2两种图表库，BizCharts主要进行了一层封装，使的图表可以以组件的形式进行调用，按需加载，使用起来更加方便