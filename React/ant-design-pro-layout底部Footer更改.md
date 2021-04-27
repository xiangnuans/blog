# ant-design-pro-layout底部Footer更改

## 场景
项目中使用ant-design-pro脚手架初始化项目，底部Footer更改

## 方案
https://github.com/ant-design/ant-design-pro-layout/issues/31

github上issues上找到相同问题，但目前还没有看到支持Footer，我目前这样解决的

```
const footerRender = (_, defaultDom) => {
  if (!isAntDesignPro()) {
    return React.cloneElement(defaultDom, { links: [], copyright: "2019 created by coco" })
  }

  return (
    <>
      {defaultDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};
```

将文件./utils/utils.js的函数return 改为false，if里的ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION改为自定义的BLOG_ADMIN
```
export const isAntDesignPro = () => {
  if (BLOG_ADMIN === 'site') {
    return false;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; 
```
