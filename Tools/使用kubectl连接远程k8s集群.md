# 什么是kubectl

- kubectl是kubernetes的客户顿啊程序
- 是用于运行kubernetes集群命令的管理工具
- 提供了大量子命令可以让用户和集群进行交互
- 不一定部署在master上，用户可以通过kubectl 连接到master上

# 安装

macOS下直接使用homebrew 管理工具进行安装

```
brew install kubernetes-cli
```

确认是否安装成功：

```
kubectl version
```

# 基本语法

```
kubectl [command] [TYPE] [NAME] [flags]
```

# 配置kubectl
```
# 配置集群名称与服务地址
kubectl config --kubeconfig=${HOME}/.kube/config set-cluster cluster-name --server=https://{IP} --inspecure-skip-tls-verify

# 设置一个管理用户为admin，并设置访问凭证。此处使用用户名和密码的验证方式
kubectl config  --kubeconfig=${HOME}/.kube/config set-credentials admin --username=username --password=pwd

# 设置一个名为admin的配置，使用cluster-name集群与admin 用户的上下文
kubectl config --kubeconfig=${HOME}/.kube/config set-context admin --cluster-cluster-name --namespace=test --user=admin

# 启用admin为默认上下文
kubectl config --kubeconfig=${HOME}/.kube/config use-context admin
```

# 预览配置
```
$ kubectl config view
apiVersion: v1
clusters:
- cluster:
    insecure-skip-tls-verify: true
    server: https://{IP}
  name: cluster-name
contexts:
- context:
    cluster: cluster-name
    namespace: test
    user: admin
  name: admin
current-context: admin
kind: Config
preferences: {}
users:
- name: admin
  user:
    password: pwd
    username: username
```

# 验证配置
```
$ kubectl cluster-info
Kubernetes master is running at https://{IP}
GLBCDefaultBackend is running at https://{IP}/api/v1/namespaces/kube-system/services/default-http-backend:http/proxy
Heapster is running at https://{IP}/api/v1/namespaces/kube-system/services/heapster/proxy
KubeDNS is running at https://{IP}/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
kubernetes-dashboard is running at https://{IP}/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy
Metrics-server is running at https://{IP}/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
```

查看集群节点：
```
$ kubectl get node
NAME                                          STATUS    ROLES     AGE       VERSION
gke-ci-cluster-1-default-pool-a7b52541-075v   Ready     <none>    3d        v1.9.7-gke.5
```

若以上输出正常，证明连接成功

