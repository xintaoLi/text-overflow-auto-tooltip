
import { debounce, merge } from 'lodash';
import tippy, { Instance, Props } from 'tippy.js';

declare global {
  interface Window {
    $TEXT_OVERFLOW_POS: HTMLElement;
  }
}

export interface ITextoverflowOption {
  target: HTMLElement | string;
  showTooltip?: boolean,
  prefix?: string,
  delay?: number
}

const defaultOption: ITextoverflowOption = {
  target: document.body,
  showTooltip: true,
  prefix: 'bk-txt-overflow',
  delay: 500
};

function resolveTarget(target?: HTMLElement | string) {
  if (!target) {
    return document.body;
  }

  if (target instanceof HTMLElement) {
    return target;
  }

  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  return target;
}

const resolveOptions = (option?: ITextoverflowOption) => {
  return merge(option, defaultOption || {});
}

const defaultTargetNodeConfig = {
  tooltip_title: '',
  tooltip_target: '',
  tooltip_disabled: true,
  tooltip_theme: 'bk-dark',
  tooltip_insert: false,
  tooltip_delay: null,
  system_title: false,
};

export const setTextOverflowTooltip = (options: ITextoverflowOption) => {
  let tippyInstance: Instance<Props> | null = null;
  let targetNode: HTMLElement | Element | undefined | null;
  let targetConfig = {...defaultTargetNodeConfig};
  let showPopInstanTimer: number;
  const hanldeMouseEnter = debounce((evt) => {
    const x = evt.clientX;
    const y = evt.clientY;
    targetNode = document.elementFromPoint(x, y);

    if (targetNode) {
      resolveTargetConfig();
    }
    const { tooltip_disabled } = targetConfig;
    if (!targetNode || tooltip_disabled) {
      return;
    }

    const isOverflow = () => {
      const checkList = [
        ['textOverflow', 'ellipsis'],
        ['overflow', 'hidden'],
        ['whiteSpace', 'nowrap']
      ];

      if (targetNode) {
        const style = window.getComputedStyle(targetNode);
        return checkList.every(item => style[item[0]] === item[1]);
      }

      return false;
    }

    if (hasOverflowEllipsis(targetNode as HTMLElement) && isOverflow()) {
      showTooltip();
    } else {
      if (targetConfig.tooltip_insert) {
        targetNode.removeAttribute('title');
        removeNodeAttribute('insert');
        resolveTargetConfig();
      }
    }
  }, 300);

  const handleMouseleave = () => {
    showPopInstanTimer && clearTimeout(showPopInstanTimer);
    tippyInstance?.hide();
    targetNode?.removeEventListener('mouseleave', handleMouseleave);
    Object.assign(targetConfig, {...defaultTargetNodeConfig});
  }

  const resolveTargetAttribute = (attributeName: string, defaultValue: boolean | string | null | number = null) => {
    const attrName = `${options.prefix}-${attributeName}`;
    if (targetNode?.hasAttribute(attrName)) {
      const value = targetNode?.getAttribute(`${options.prefix}-${attributeName}`);
      if (value === null || value === '') {
        return defaultValue;
      }
    
      return value;
    }
    
    return undefined;
  }

  const setTargetNodeAttribute = (name: string, value: string) => {
    const attrName = `${options.prefix}-${name}`;
    targetNode?.setAttribute(attrName, value);
  }

  const removeNodeAttribute = (name: string) => {
    const attrName = `${options.prefix}-${name}`;
    targetNode?.removeAttribute(attrName);
  }
  
  const resolveTargetConfig = () => {
    Object.assign(targetConfig, {
      tooltip_title: resolveTargetAttribute('title'),
      tooltip_target: resolveTargetAttribute('target'),
      tooltip_disabled: resolveTargetAttribute('disabled', true) || targetNode?.closest(`[${options.prefix}-disabled]`),
      tooltip_theme: resolveTargetAttribute('theme', 'bk-dark'),
      tooltip_insert: resolveTargetAttribute('insert', false),
      tooltip_delay: resolveTargetAttribute('delay', options.delay),
      system_title: resolveTargetAttribute('system', true),
    });
  }

  const showTooltip = () => {
    // 需要显示的内容
    // 如果设置了data-show-title优先展示，否则展示当前子元素内容
    let targetValue: string | Element | undefined | null;
    const { tooltip_title, tooltip_target, tooltip_disabled, tooltip_theme, tooltip_delay, system_title } = targetConfig;
    if (tooltip_disabled) {
      return;
    }

    if (options.showTooltip && !/true/.test(`${system_title}`)) {
      //指定tooltip target
      // 这里会将target当做querySelector进行查询
      if (typeof tooltip_target === 'string') {
        targetValue = document.querySelector(tooltip_target)?.innerHTML;
      } else {
        targetValue = tooltip_title as string
          || ((targetNode as HTMLInputElement).value
          || targetNode?.innerHTML);
      }

      targetNode?.addEventListener('mouseleave', handleMouseleave);
      showPopInstanTimer && clearTimeout(showPopInstanTimer);
      tippyInstance?.destroy();
      showPopInstanTimer = setTimeout(() => {
        tippyInstance = tippy((targetNode as HTMLElement), {
          content: targetValue || 'null',
          allowHTML: true,
          arrow: true,
          theme: tooltip_theme || 'bk-dark',
          trigger: 'manual',
          onHidden: () => {
            tippyInstance = null;
            replaceNodeAttribute('data-title', 'title', targetNode as HTMLElement);
          }
        });
        
        replaceNodeAttribute('title', 'data-title', targetNode as HTMLElement);
        tippyInstance.show();
      }, Number(tooltip_delay));
    } else {
      targetValue = tooltip_title as string
        || ((targetNode as HTMLInputElement).value
        || (targetNode as HTMLElement)?.innerText);

      if (!targetNode?.hasAttribute('title')) {
        targetNode?.setAttribute('title', targetValue);
        setTargetNodeAttribute('insert', '1');
        resolveTargetConfig();
      }
    }
  }

  resolveTarget(options.target)?.addEventListener('mouseover', hanldeMouseEnter);
}

function replaceNodeAttribute(source: string, target: string, node?: HTMLElement | null) {
  if (node?.hasAttribute(source)) {
    node.setAttribute(target, `${node.getAttribute(source)}`);
  }  
}


/**
 * Whether the text content is clipped due to CSS overflow, as in showing `...`.
 */
export function hasOverflowEllipsis(element: HTMLElement) {
  if (['SPAN'].includes(element.tagName)) {
    if (!window.$TEXT_OVERFLOW_POS) {
      const div = document.createElement('div');
      window.$TEXT_OVERFLOW_POS = div;
      document.body.append(window.$TEXT_OVERFLOW_POS);
    }

    const copyCssList = ['font', 'box-sizing', 'border-width'];
    copyCssStyleToTargetNode(element, window.$TEXT_OVERFLOW_POS, copyCssList);
    window.$TEXT_OVERFLOW_POS.style.setProperty('position', 'absolute');
    window.$TEXT_OVERFLOW_POS.style.setProperty('left', '-9999');
    window.$TEXT_OVERFLOW_POS.style.setProperty('top', '-9999');
    window.$TEXT_OVERFLOW_POS.innerText = element.innerText;
    return element.offsetWidth < window.$TEXT_OVERFLOW_POS.offsetWidth;
  }

  return element.offsetWidth < element.scrollWidth;
}

export function copyCssStyleToTargetNode (sourceNode: HTMLElement, targetNode: HTMLElement, propertyList: string[] = []) {
  const styles = window.getComputedStyle(sourceNode);
  if (propertyList.length > 0) {
    const cssText = propertyList.reduce((css, propertyName) =>
      `${css}${propertyName}:${styles.getPropertyValue(propertyName)};`, '');
    targetNode.style.cssText = cssText
    return;
  }
  if (styles.cssText !== '') {
    targetNode.style.cssText = styles.cssText;
  } else {
      const cssText = Object.values(styles).reduce(
          (css, propertyName) =>
              `${css}${propertyName}:${styles.getPropertyValue(
                  propertyName
              )};`
      );

      targetNode.style.cssText = cssText
  }
}


export default (options: ITextoverflowOption) => {
  setTextOverflowTooltip(resolveOptions(options));
}
