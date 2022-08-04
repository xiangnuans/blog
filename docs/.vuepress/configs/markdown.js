const markdownConfig = {
    lineNumbers: true, // 显示代码块行号
    extractHeaders: ["h1", "h2", "h3", "h4", "h5", "h6"] // VuePress默认只会提取h2和h3标题,你可以通过这个选项来修改提取出的标题级别,分别支持h1~h6
  };
  
  module.exports = markdownConfig;