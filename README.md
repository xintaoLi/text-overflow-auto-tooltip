### 配置项
```javascript
ITextoverflowOption = {
  target: document.body,
  showTooltip: true,
  prefix: 'bk-txt-overflow',
  delay: 500
};
```

### 节点弹出内容配置
```javascript
TargetNodeConfig = {
  `${prefix}-title`: '指定需要显示的内容，如果不设置默认显示TargetNode.innerText，如果是`showTooltip=true`，默认显示`TargetNode.innerHTML`',
  `${prefix}-target`: '配合设置`showTooltip=true`生效，用于指定弹出内容的目标元素选择器',
  `${prefix}-disabled`: '禁用当前DOM文本溢出显示，同时禁用当前节点下面所有子节点的自动文本溢出',
  `${prefix}-theme`: '配合设置`showTooltip=true`生效，用于指定弹出内容的主题，默认内置`bk-dark | bk-light`',
  `${prefix}-delay`: '配合设置`showTooltip=true`生效，用于指定弹出内容延迟时间，默认继承 ITextoverflowOption.delay`',
  `${prefix}-system`: '如果全局设置 showTooltip=true，单个元素可指定为system title，此时会启用默认title，而不是tooltip',
};
```

### 使用
```javascript
  import SetTextOverflowTooltip from './src/index.ts';
  SetTextOverflowTooltip({});
```

### 引入样式
```javascript
  <link type="text/css" rel="stylesheet" href="./src//tippy-theme/index.scss" />
  <link type="text/css" rel="stylesheet" href="./src//tippy-theme/bk-dark.scss" />
  <link type="text/css" rel="stylesheet" href="./src//tippy-theme/bk-light.scss" />
  <link type="text/css" rel="stylesheet" href="./src//tippy-theme/bk-error.scss" />
```

### 示例
```javascript
      <div class="row">
        <div class="title">基础用法</div>
        <div class="content">
          提供专业的UI界面搭建工具，使前端研发更高效
          拥有多元化前端组件库、多样化页面套餐样例以及在线拖拽可视化开发服务
          您可以轻松搭建满足自己需求场景的网页
        </div>
      </div>
      <div class="row">
        <div class="title">切换主题</div>
        <div class="content" bk-txt-overflow-theme="bk-light">
          提供专业的UI界面搭建工具，使前端研发更高效
          拥有多元化前端组件库、多样化页面套餐样例以及在线拖拽可视化开发服务
          您可以轻松搭建满足自己需求场景的网页
        </div>
      </div>
      <div class="row">
        <div class="title">禁止自动Tooltip</div>
        <div class="content" bk-txt-overflow-disabled>
          提供专业的UI界面搭建工具，使前端研发更高效
          拥有多元化前端组件库、多样化页面套餐样例以及在线拖拽可视化开发服务
          您可以轻松搭建满足自己需求场景的网页
        </div>
      </div>
      <div class="row">
        <div class="title">启用系统Title</div>
        <div class="content" bk-txt-overflow-system>
          提供专业的UI界面搭建工具，使前端研发更高效
          拥有多元化前端组件库、多样化页面套餐样例以及在线拖拽可视化开发服务
          您可以轻松搭建满足自己需求场景的网页
        </div>
      </div>
      <div class="row">
        <div class="title">自定义显示内容</div>
        <div class="content" bk-txt-overflow-title="这是一段自定义的显示文本，跟内容没啥关系，你可以自己试试">
          提供专业的UI界面搭建工具，使前端研发更高效
          拥有多元化前端组件库、多样化页面套餐样例以及在线拖拽可视化开发服务
          您可以轻松搭建满足自己需求场景的网页
        </div>
      </div>
      <div class="row">
        <div class="title">指定弹出其他DOM</div>
        <div class="content" bk-txt-overflow-target="#target_dom_id">
          提供专业的UI界面搭建工具，使前端研发更高效
          拥有多元化前端组件库、多样化页面套餐样例以及在线拖拽可视化开发服务
          您可以轻松搭建满足自己需求场景的网页
        </div>
      </div>
      <div id="target_dom_id" style="display: none;">
        <div class="row">
          <div class="title">这是一个隐藏DIV</div>
          <div class="content" bk-txt-overflow-title="这是一段自定义的显示文本，跟内容没啥关系，你可以自己试试">
            提供专业的UI界面搭建工具，使前端研发更高效
            拥有多元化前端组件库、多样化页面套餐样例以及在线拖拽可视化开发服务
            您可以轻松搭建满足自己需求场景的网页
          </div>
        </div>
      </div>
```