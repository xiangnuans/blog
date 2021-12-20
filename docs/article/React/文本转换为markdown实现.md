将后端返回的文本转换为markdown，显示为HTML页面

# 转换为markdown
```
//markdown.js

// https://www.cherylgood.cn/detail/5bdaf4722382b4646c27143b.html
const highlight = require("highlight.js");
const marked = require("marked");
const tocObj = {
  add: function (text, level) {
    var anchor = `#toc${level}${++this.index}`;
    this.toc.push({ anchor: anchor, level: level, text: text });
    return anchor;
  },
  toHTML: function () {
    let levelStack = [];
    let result = "";
    const addStartUL = () => {
      result += '<ul class="anchor-ul" id="anchor-fix">';
    };
    const addEndUL = () => {
      result += "</ul>\n";
    };
    const addLI = (anchor, text) => {
      result +=
        '<li><a class="toc-link" href="#' + anchor + '">' + text + "<a></li>\n";
    };

    this.toc.forEach(function (item) {
      let levelIndex = levelStack.indexOf(item.level);
      // 没有找到相应level的ul标签，则将li放入新增的ul中
      if (levelIndex === -1) {
        levelStack.unshift(item.level);
        addStartUL();
        addLI(item.anchor, item.text);
      } // 找到了相应level的ul标签，并且在栈顶的位置则直接将li放在此ul下
      else if (levelIndex === 0) {
        addLI(item.anchor, item.text);
      } // 找到了相应level的ul标签，但是不在栈顶位置，需要将之前的所有level出栈并且打上闭合标签，最后新增li
      else {
        while (levelIndex--) {
          levelStack.shift();
          addEndUL();
        }
        addLI(item.anchor, item.text);
      }
    });
    // 如果栈中还有level，全部出栈打上闭合标签
    while (levelStack.length) {
      levelStack.shift();
      addEndUL();
    }
    this.toc = [];
    this.index = 0;
    return result;
  },
  toc: [],
  index: 0
};

class MarkUtils {
  constructor() {
    this.rendererMD = new marked.Renderer();
    this.rendererMD.heading = function (text, level, raw) {
      var anchor = tocObj.add(text, level);
      return `<h${level} id=${anchor}>${text}</h${level}>\n`;
    };
    this.rendererMD.table = function (header, body) {
      return '<table class="table" border="0" cellspacing="0" cellpadding="0">' + header + body + '</table>'
    }
    highlight.configure({ useBR: true });
    marked.setOptions({
      renderer: this.rendererMD,
      headerIds: false,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: function (code) {
        return highlight.highlightAuto(code).value;
      }
    });
  }

  async marked(data) {
    if (data) {
      let content = await marked(data);
      let toc = tocObj.toHTML();
      return { content: content, toc: toc };
    } else {
      return null;
    }
  }
}

const markdown = new MarkUtils();

export default markdown;

```

# 调用转换

```
// 在其他文件中引用

const contentmd = markdown.marked(content);
contentmd.then(md => {
  // 进一步处理
})；
```

# 页面渲染处理

```
// 示例
<div className="content">
  <div
    id="content"
    className="article-detail"
    dangerouslySetInnerHTML={{
      __html: content ? content : null,
    }}
  />
</div>
```