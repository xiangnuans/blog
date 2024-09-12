---
title: 从零开始：NestJS 入门指南——构建现代 Web 应用的高效框架
date: 2024-9-12
---

### 1. 引言
NestJS 是一个基于 Node.js 的渐进式框架，专为构建高效且可扩展的服务器端应用程序而设计。它采用了 TypeScript 作为主要语言，并深受 Angular 架构的启发，注重模块化设计和面向对象编程。NestJS 的核心目标是提高代码的可维护性和测试性，同时提供现代 Web 开发中的所有关键功能。

在本指南中，我们将从零开始，了解 NestJS 的核心概念，并通过实际操作创建一个简单的 Web 应用程序。

---

### 2. NestJS 的核心概念

在 NestJS 中，以下是几个最重要的核心概念：

- **模块 (Modules)**: 模块是 NestJS 的组织单元，所有功能和组件都围绕模块进行组织。每个应用至少有一个根模块 `AppModule`。
  
- **控制器 (Controllers)**: 控制器负责处理传入的 HTTP 请求，并将请求的响应发送回客户端。每个控制器主要处理特定的 URL 路由。

- **服务 (Providers/Services)**: 服务通常用来处理与业务逻辑相关的任务。服务可以通过依赖注入 (Dependency Injection) 的方式在控制器中使用。

- **中间件 (Middleware)**: 在处理请求时，NestJS 提供了使用中间件的方式，来修改请求或响应的行为。中间件可以用来记录日志、处理身份验证等。

---

### 3. 环境搭建

在开始使用 NestJS 之前，你需要确保安装了 Node.js 以及 NestJS 的 CLI 工具。以下是环境搭建的步骤：

- **安装 Node.js**: 你可以在 [Node.js 官方网站](https://nodejs.org/) 下载最新版本。
  
- **安装 NestJS CLI**: 在终端中运行以下命令来全局安装 NestJS CLI：
  ```bash
  npm install -g @nestjs/cli
  ```

- **创建新项目**: 使用以下命令创建一个新的 NestJS 项目：
  ```bash
  nest new project-name
  ```

此时，CLI 将会提示你选择包管理工具，可以选择 `npm` 或 `yarn`。安装完成后，CLI 会生成一个包含基本项目结构的项目文件夹。

---

### 4. 创建第一个 NestJS 应用

接下来，我们来构建一个简单的 NestJS 应用程序。假设我们要创建一个处理用户数据的简单 API。

#### 4.1 创建控制器

首先，我们需要创建一个 `UsersController` 来处理所有与用户相关的请求。运行以下命令生成控制器：
```bash
nest generate controller users
```

CLI 会自动在 `src/users` 文件夹下生成 `users.controller.ts` 文件。在该文件中，我们可以定义路由以及对应的请求处理方法。例如：
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(): string {
    return '返回所有用户';
  }
}
```

#### 4.2 创建服务

为了处理用户的业务逻辑，我们还需要一个 `UsersService`。运行以下命令生成服务：
```bash
nest generate service users
```

服务将包含主要的业务逻辑，并通过依赖注入方式在控制器中使用。例如，在 `users.service.ts` 中可以定义获取用户的方法：
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll(): string {
    return '这里是用户数据';
  }
}
```

接着，在 `users.controller.ts` 中，我们可以注入该服务：
```typescript
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): string {
    return this.usersService.findAll();
  }
}
```

#### 4.3 启动服务器

确保 `app.module.ts` 中已经注册了 `UsersController` 和 `UsersService`。然后在终端中运行：
```bash
npm run start
```

此时，NestJS 服务器将在默认的 `http://localhost:3000` 端口启动，并处理 `GET /users` 请求，返回我们在服务中定义的用户数据。

---

### 5. 结语

通过以上步骤，你已经成功创建了一个简单的 NestJS 应用程序。虽然本示例非常基础，但它展示了 NestJS 的核心概念和模块化设计。NestJS 提供了许多强大的功能，如依赖注入、管道 (Pipes)、守卫 (Guards)、拦截器 (Interceptors) 等，能够帮助开发者构建复杂的企业级应用。

今后的博客中，我们将进一步探索 NestJS 的高级功能，如数据库集成、身份验证、实时 WebSocket 支持等。希望本篇入门指南能帮助你快速上手 NestJS，开始构建现代 Web 应用。

