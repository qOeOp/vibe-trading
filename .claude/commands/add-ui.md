添加 shadcn UI 组件 "$ARGUMENTS" 到项目中。

步骤：

1. 使用 shadcn MCP 工具搜索组件：`search_items_in_registries` 查找 "$ARGUMENTS"
2. 使用 `view_items_in_registries` 查看组件源码
3. 使用 `get_item_examples_from_registries` 查看用法示例
4. 使用 `get_add_command_for_items` 获取安装命令
5. 运行安装命令
6. 检查安装后的组件文件，确保：
   - 使用 `cn()` from `@/lib/utils`
   - 有 `data-slot` 属性
   - 命名导出
   - 颜色使用 Mine 主题 token
7. 运行 `get_audit_checklist` 验证
