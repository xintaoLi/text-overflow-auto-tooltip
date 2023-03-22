
import { debounce } from 'lodash';

declare global {
  interface Window {
    $TEXT_OVERFLOW_POS: HTMLElement;
  }
}

export interface ITextoverflowOption {
  target: HTMLElement | string;
}

export const setTextOverflowTooltip = (options) => {
  const hanldeMouseEnter = debounce((evt) => {
    const x = evt.clientX;
    const y = evt.clientY;
    const targetNode = document.elementFromPoint(x, y);
    if (!targetNode || targetNode.hasAttribute('data-disable-title')) {
      return;
    }

    const hasShowTitle = targetNode.hasAttribute('data-show-title');
    if (hasShowTitle || targetNode && !targetNode.lastElementChild) {
      const targetValue = hasShowTitle ? targetNode.getAttribute('data-show-title') : ((targetNode as HTMLInputElement).value || targetNode.innerHTML);
      maybeShowTooltip((evt.target as HTMLElement), targetValue || '');
    }
  }, 300);

  document.querySelector("body")?.addEventListener('mouseover', hanldeMouseEnter);
}

/**
 * Sets the `title` attribute in the event's element target, when the text
 * content is clipped due to CSS overflow, as in showing `...`.
 */
export function maybeShowTooltip(target: HTMLElement, title: string) {
  if (hasOverflowEllipsis(target)) {
    target.setAttribute('title', title);
  } else {
    target.removeAttribute('title');
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

  return element.offsetWidth < element.scrollWidth ||
      element.offsetHeight < element.scrollHeight;
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
              `${css}${propertyName}:${styles.getPropertyValue(propertyName)};`
      );

      targetNode.style.cssText = cssText;
  }
}

export default (options: ITextoverflowOption) => {
  setTextOverflowTooltip({});
}
