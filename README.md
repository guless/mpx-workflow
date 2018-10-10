使用教程
------
```bash
# 创建一个新的项目
git init
git remote add workflow https://github.com/guless/mpx-workflow.git
git fetch workflow
git merge workflow/master

git remote add origin https://github.com/{你的仓库的地址}.git
git push -u origin master

# 如果后续更新工作流可以直接将 workflow/master 合并至你的分支中！
# git merge workflow/master

# 安装 npm 依赖项
npm i
```


## 命令行
 任务          | 说明
--------------|-----------------------------------------------------------
`dev`   | 同 `watch` 任务。
`start` | 同 `watch` 任务。
`watch` | 启动开发模式。在开发模式下会自动监听文件改动触发重新编译。
`build` | 编译生产模式。生产模式不会监听文件改动，仅执行一次编译。在生产模式下，`dist` 目录中的文件会被清空，然后重新输出一份。使用生产模式会对所有的区块(chunk)、模块(module)、资源(resource)进行压缩和优化。
`watch:test` | 启动开发模式，使用【测试环境】的接口。等同于：`npm run watch -- --env.target=test`。
`watch:beta` | 启动开发模式，使用【预览环境】的接口。等同于：`npm run watch -- --env.target=beta`。
`watch:prod` | 启动开发模式，使用【生产环境】的接口。等同于：`npm run watch -- --env.target=prod`。
`build:test` | 编译生产模式，使用【测试环境】的接口。等同于：`npm run build -- --env.target=test`。
`build:beta` | 编译生产模式，使用【预览环境】的接口。等同于：`npm run build -- --env.target=beta`。
`build:prod` | 编译生产模式，使用【生产环境】的接口。等同于：`npm run build -- --env.target=prod`。

>注：通过在命令行输入 `npm run {任务}` 来运行对应的任务。

## 命令行参数
 名称           | 示例                                       | 说明
---------------|-------------------------------------------|-------------
`--env.mode`   | `npm run build -- --env.mode=development` | 指定编译模式。<ul><li>`"development"`：开发模式</li><li>`"production"`：生产模式</li></ul>
`--env.target` | `npm run build -- --env.target=test`      | 指定开发环境。<ul><li>`"test"`：测试环境</li><li>`"beta"`：预览环境</li><li>`"prod"`：生产环境</li></ul>
