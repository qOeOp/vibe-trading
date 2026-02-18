为 feature "$ARGUMENTS" 启动 doc-first 开发流程。

步骤：

1. 检查 `apps/web/src/features/blueprint/docs/$ARGUMENTS/` 是否已有 blueprint 文档
   - 如果没有，创建基础 blueprint `.md` 文件（参考 `.claude/rules/blueprint-layout-design.md` 的 frontmatter schema）
   - 如果已有，读取现有文档了解当前设计
2. 询问用户本次要实现的具体功能点
3. 更新 blueprint 文档，添加本次功能的设计描述
4. 确认用户认可文档描述后，再开始编写代码
