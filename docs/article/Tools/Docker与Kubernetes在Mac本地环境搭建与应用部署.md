[Docker官网](https://docs.docker.com/ee/)

# Homebrew安装
macOS我们可以使用Homebrew来安装docker
Homebrew 的 Cask 已经支持 Docker for Mac，因此可以很方便的使用 Homebrew Cask 来进行安装：
```
# 安装命令
brew cask install docker

==> Satisfying dependencies
==> Downloading https://download.docker.com/mac/stable/28905/Docker.dmg
######################################################################## 100.0%
==> Verifying SHA-256 checksum for Cask 'docker'.
==> Installing Cask docker
==> Moving App 'Docker.app' to '/Applications/Docker.app'.
  docker was successfully installed!
```

# 手动安装
下载最新的Docker for Mac或者Edge版本，即可以看到内置的kubernets集群，直接点击安装即可

![](https://upload-images.jianshu.io/upload_images/9403248-e287d34bf5d15034.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

安装完毕后，如果页勾选了Show system containers选项，那么使用如下的Docker命令，能看到自动安装的kubernetes相关容器：

```
➜  ~ docker container ls --format "table{{.Names}}\t{{.Image }}\t{{.Command}}"
NAMES                                                                                                                   IMAGE                                                    COMMAND
k8s_compose_compose-75f8bb4779-stxv9_docker_3c963862-f9f4-11e7-93cc-025000000001_0                                      docker/kube-compose-controller                           "/compose-controller…"
k8s_POD_compose-75f8bb4779-stxv9_docker_3c963862-f9f4-11e7-93cc-025000000001_0                                          gcr.io/google_containers/pause-amd64:3.0                 "/pause"
k8s_sidecar_kube-dns-545bc4bfd4-799pr_kube-system_139bf000-f9f4-11e7-93cc-025000000001_0                                gcr.io/google_containers/k8s-dns-sidecar-amd64           "/sidecar --v=2 --lo…"
k8s_dnsmasq_kube-dns-545bc4bfd4-799pr_kube-system_139bf000-f9f4-11e7-93cc-025000000001_0                                gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64     "/dnsmasq-nanny -v=2…"
k8s_kubedns_kube-dns-545bc4bfd4-799pr_kube-system_139bf000-f9f4-11e7-93cc-025000000001_0                                gcr.io/google_containers/k8s-dns-kube-dns-amd64          "/kube-dns --domain=…"
k8s_kube-proxy_kube-proxy-rrd8t_kube-system_139b00df-f9f4-11e7-93cc-025000000001_0                                      gcr.io/google_containers/kube-proxy-amd64                "/usr/local/bin/kube…"
k8s_POD_kube-dns-545bc4bfd4-799pr_kube-system_139bf000-f9f4-11e7-93cc-025000000001_0                                    gcr.io/google_containers/pause-amd64:3.0                 "/pause"
k8s_POD_kube-proxy-rrd8t_kube-system_139b00df-f9f4-11e7-93cc-025000000001_0                                             gcr.io/google_containers/pause-amd64:3.0                 "/pause"
k8s_kube-scheduler_kube-scheduler-docker-for-desktop_kube-system_972d74c9fc2f4ebd8ab673058e386a65_0                     gcr.io/google_containers/kube-scheduler-amd64            "kube-scheduler --ad…"
k8s_kube-apiserver_kube-apiserver-docker-for-desktop_kube-system_f7a81e8fe624bd46059fc6084e86bb81_0                     gcr.io/google_containers/kube-apiserver-amd64            "kube-apiserver --ad…"
k8s_etcd_etcd-docker-for-desktop_kube-system_56a21c0a5f545c0cca5388c457bb1b3b_0                                         gcr.io/google_containers/etcd-amd64                      "etcd --advertise-cl…"
k8s_kube-controller-manager_kube-controller-manager-docker-for-desktop_kube-system_8d1848c1e562e35a225e402988eadcd1_0   gcr.io/google_containers/kube-controller-manager-amd64   "kube-controller-man…"
k8s_POD_kube-apiserver-docker-for-desktop_kube-system_f7a81e8fe624bd46059fc6084e86bb81_0                                gcr.io/google_containers/pause-amd64:3.0                 "/pause"
k8s_POD_kube-controller-manager-docker-for-desktop_kube-system_8d1848c1e562e35a225e402988eadcd1_0                       gcr.io/google_containers/pause-amd64:3.0                 "/pause"
k8s_POD_kube-scheduler-docker-for-desktop_kube-system_972d74c9fc2f4ebd8ab673058e386a65_0                                gcr.io/google_containers/pause-amd64:3.0                 "/pause"
k8s_POD_etcd-docker-for-desktop_kube-system_56a21c0a5f545c0cca5388c457bb1b3b_0 
```

关于各个容器的作用，可以残月[这里](https://github.com/kubernetes/kubernetes/tree/master/build)。在安装过程中，Docker页为我们安装了kubectl控制命令：
```
$ kubectl get namespaces
$ kubectl get posts --namespace kube-system
```

接下来我们可以使用kubectl命令来创建简单的kubernets-dashboard服务：
```
➜  ~ kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
secret "kubernetes-dashboard-certs" created
serviceaccount "kubernetes-dashboard" created
role "kubernetes-dashboard-minimal" created
rolebinding "kubernetes-dashboard-minimal" created
deployment "kubernetes-dashboard" created
service "kubernetes-dashboard" created
```

服务安装完毕后可以查看部署的容器和服务：
```
➜  ~ kubectl get deployments --namespace kube-system
NAME                   DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
kube-dns               1         1         1            1           22m
kubernetes-dashboard   1         1         1            0           26s
➜  ~ kubectl get services --namespace kube-system
NAME                   TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE
kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP   22m
kubernetes-dashboard   ClusterIP   10.111.242.95   <none>        443/TCP         30s
```

在Dashboard启动完毕后，可以使用kubectl提供的Proxy服务来访问该面板：

```
$ kubectl proxy

# 打开如下地址：
# http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
```

如果访问出错，可以尝试kubernetes-dashboard服务，或者查阅[这里](https://github.com/kubernetes/dashboard/wiki/Accessing-Dashboard---1.7.X-and-above)

```
$ kubectl -n kube-system edit service kubernetes-dashboard

# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: v1
...
  name: kubernetes-dashboard
  namespace: kube-system
  resourceVersion: "343478"
  selfLink: /api/v1/namespaces/kube-system/services/kubernetes-dashboard-head
  uid: 8e48f478-993d-11e7-87e0-901b0e532516
spec:
  clusterIP: 10.100.124.90
  externalTrafficPolicy: Cluster
  ports:
  - port: 443
    protocol: TCP
    targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard
  sessionAffinity: None
  type: ClusterIP ->> NodePort
status:
  loadBalancer: {}
```

访问上述地址，我们可以看到登陆界面：
![kubernetes登陆界面](https://upload-images.jianshu.io/upload_images/9403248-c6881f0c4bc40cf5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

此时可暂时直接跳过，进入到控制面板中
![kubernetes](https://upload-images.jianshu.io/upload_images/9403248-dd1431fe9341d11b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Docker同样为我们提供了简单的应用示范，可以直接使用如下的Docker Compose配置文件：

```
version: '3.3'

services:
  web:
    build: web
    image: dockerdemos/lab-web
    volumes:
     - "./web/static:/static"
    ports:
     - "80:80"

  words:
    build: words
    image: dockerdemos/lab-words
    deploy:
      replicas: 5
      endpoint_mode: dnsrr
      resources:
        limits:
          memory: 16M
        reservations:
          memory: 16M

  db:
    build: db
    image: dockerdemos/lab-db

```
然后使用stack命令创建应用栈：

```
$ docker stack deploy --compose-file stack.yml demo

Stack demo was created
Waiting for the stack to be stable and running...
 - Service web has one container running
```

应用栈创建完毕后，可以使kubectl查看创建的Pods:

```
$ kubectl get pods

NAME                     READY     STATUS    RESTARTS   AGE
db-7f99cc64b7-cbd9t      1/1       Running   0          2m
web-758c6998f8-tmxfm     1/1       Running   0          2m
words-54bf6c5d57-8bxc8   1/1       Running   0          2m
words-54bf6c5d57-dzxm8   1/1       Running   0          2m
words-54bf6c5d57-k2448   1/1       Running   0          2m
words-54bf6c5d57-mhh4p   1/1       Running   0          2m
words-54bf6c5d57-w2q82   1/1       Running   0          2m
```
也可以来查看部署的集群与服务：

```
$ kubectl get deployments
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
db        1         1         1            1           3m
web       1         1         1            1           3m
words     5         5         5            5           3m

$ kubectl get services
NAME         TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
db           ClusterIP      None           <none>        55555/TCP      3m
kubernetes   ClusterIP      10.96.0.1      <none>        443/TCP        52m
web          LoadBalancer   10.97.154.28   <pending>     80:30577/TCP   3m
words        ClusterIP      None           <none>        55555/TCP      3m
```

可以看到这里的web有所谓的LoadBalancer类型，机可以对外提供服务。最后我们可以用stack与kubectl名利ing来删除应用：

```
$ docker stack remove demo
$ kubectl delete deployment kubernetes-dashboard --namespace kube-system
```

# 镜像加速

鉴于国内网络问题，后续拉取Docker镜像十分缓慢，我们需要配置加速期来解决，

- [官网](https://registry.docker-cn.com)
- [网易](http://hub-mirror.c.163.com)
- [阿里云](http://dev.aliyun.com/search.html): 阿里云的镜像官方地址是：http://dev.aliyun.com/search.html， 开发这需要开通阿里开发者账户，登陆后https://cr.console.aliyun.com/undefined/instances/mirrors 中查看你的专属加速器地址