### 配置项
```javascript
const defaultOption: ITextoverflowOption = {
  target: document.body,
  showTooltip: true,
  prefix: 'bk-txt-overflow'
};
```

### 节点弹出内容配置
```javascript
const defaultTargetNodeConfig = {
  `${prefix}-title`: '指定需要显示的内容，如果不设置默认显示TargetNode.innerText，如果是`showTooltip=true`，默认显示`TargetNode.innerHTML`',
  `${prefix}-target`: '配合设置`showTooltip=true`生效，用于指定弹出内容的目标元素选择器',
  `${prefix}-disabled`: '禁用当前DOM文本溢出显示，同时禁用当前节点下面所有子节点的自动文本溢出',
  `${prefix}-theme`: '配合设置`showTooltip=true`生效，用于指定弹出内容的主题，默认内置`bk-dark | bk-light`',
};
```