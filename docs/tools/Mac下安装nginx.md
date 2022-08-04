# Mac下安装nginx

## 必备工具
homebrew[https://brew.sh/index_zh-cn.html](https://brew.sh/index_zh-cn.html)（安装方法自行搜索）

安装完毕后代开命令行

## 步骤一：先更新homebrew

```
brew update
```

如果上面操作长时间没有任何动静，请更换镜像，参考清华镜像

[https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)

## 步骤二： 查看nginx信息

```
brew search nginx
```

## 步骤三： 安装nginx

```
brew install nginx
```
安装完毕
主页的文件在/usr/local/var/www 文件夹下
对应的配置文件地址在/usr/local/etc/nginx/nginx.conf

## 步骤四：运行nginx

```
nginx
```
nginx默认使用8080端口 如果发现端口被占用了，可以杀掉使用使用改端口的进程，也可以修改/usr/local/etc/nginx/nginx.conf 下的

```js
http {
    server {
        listen       8181;
        server_name  localhost;

        #charset koi8-r;
        .....
        }
    }
```

## 重新启动nginx

```
nginx -s reload
```
成功看到欢迎页面～！（对应的html是/usr/local/var/www/index.html）

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-23-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-11-23%20%E4%B8%8A%E5%8D%8811.40.27.png)
