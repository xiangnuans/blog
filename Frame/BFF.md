# BFF

Backend for Fronted

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-22-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-10-22%20%E4%B8%8B%E5%8D%885.40.07.png?Expires=1571741097&OSSAccessKeyId=TMP.hbqbJX5L2t95VjoVJBmmwDpQunV5RKHUgmTwVbqWZtk8magqoiw5aFSFRwmVS8yevESo2hEgBNoHw3TqLV47tvoLGRKsGamCQ72buuqknXTJsq9HEHqofTrCLQdU27.tmp&Signature=eRUukIySnAAabHZw%2B%2Fk5M7cuHnQ%3D)

BFF是目前一种前后顿啊分离的常用研发模式，通常BFF作为胶水层，解决了终端对于数据多样性的问题，通过对后端为服务进行聚合，从而提供各种定制化的数据给到终端应用。

在BFF技术选型上，选用Node是为了技术栈的统一，从而可以让前端同学从前端UI实现到聚合层接口实现都通过JavaScript完成。这样服务端同学只需要按照领域设计原则暴露各个领域的标准化接口，其他部分前端同学可以通过灵活组合满足各种页面的数据服务需求，达到前后端的分离和研发效率提升。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-22-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-10-22%20%E4%B8%8B%E5%8D%885.40.07.png?Expires=1571741877&OSSAccessKeyId=TMP.hbqbJX5L2t95VjoVJBmmwDpQunV5RKHUgmTwVbqWZtk8magqoiw5aFSFRwmVS8yevESo2hEgBNoHw3TqLV47tvoLGRKsGamCQ72buuqknXTJsq9HEHqofTrCLQdU27.tmp&Signature=RmFT5DD%2BN4eWP1hzCzuTG4WhwK0%3D)

**前端服务层** 基于Node.js和Koa实现了egg框架，egg.js为企业级框架和应用而生，有Egg.js孕育出更多上层框架，帮助开发团队和开发人员降低开发和维护成本。Egg提供了一个完善灵活的插件机制，并且奉行约定优于配置。在Egg上层，各个业务团队又各自封装了不同的服务层框架，例如蚂蚁Chair、淘宝Midway、UC Nut等等。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-22-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-10-22%20%E4%B8%8B%E5%8D%885.40.07-1.png?Expires=1571742368&OSSAccessKeyId=TMP.hbqbJX5L2t95VjoVJBmmwDpQunV5RKHUgmTwVbqWZtk8magqoiw5aFSFRwmVS8yevESo2hEgBNoHw3TqLV47tvoLGRKsGamCQ72buuqknXTJsq9HEHqofTrCLQdU27.tmp&Signature=YSVhE8Ckz4SqFpnYkg2NCS0%2BhIo%3D)

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-22-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-10-22%20%E4%B8%8B%E5%8D%885.57.12-1.png?Expires=1571742436&OSSAccessKeyId=TMP.hbqbJX5L2t95VjoVJBmmwDpQunV5RKHUgmTwVbqWZtk8magqoiw5aFSFRwmVS8yevESo2hEgBNoHw3TqLV47tvoLGRKsGamCQ72buuqknXTJsq9HEHqofTrCLQdU27.tmp&Signature=9fWgg7wfrj4%2Fig1VxKOemktWaN0%3D)

Serverless 是阿里内部一个非常重要的方向，目前阿里云已经提供云函数的能力，然后再基于现有的Baas（通信、用户、存储、运维、通知），可以实现BFF层使用云函数来实现，从而大大减少服务器资源的消耗，也极大的减少了前端开发同学对于服务器运维的要求。

