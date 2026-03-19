import { defineElement, css, useHost, useEffect } from '@sparkio/core';
import { getRegistry } from '../lib/widgets/widget-registry';

defineElement(
  {
    tag: 'fit-palette',
    styles: css`
      @unocss-placeholder
      :host {
        @apply "flex flex-col w-45 py-2 z-20 box-border overflow-y-auto";
        background-color: #2d2d44;
        border-right: 1px solid #3a3a5c;
      }
      .section-title {
        @apply "text-xs font-semibold uppercase px-3 py-2";
        color: #aaa;
      }
      .palette-item {
        @apply "flex items-center gap-2 px-3 py-2 text-xs cursor-pointer select-none";
        color: #ccc;
        transition: background 0.15s;
      }
      .palette-item:hover {
        background-color: #3a3a5c;
        color: #fff;
      }
      .palette-item .tag {
        @apply "text-xs font-mono";
        color: #888;
      }
    `,
  },
  () => {
    const hostRef = useHost();

    useEffect(() => {
      const root = hostRef.current.shadowRoot;
      if (!root) return;
      const items = root.querySelectorAll('.palette-item');
      const handlers: Array<() => void> = [];
      items.forEach(item => {
        const handler = () => {
          const kind = (item as HTMLElement).dataset.kind;
          if (kind) window.dispatchEvent(new CustomEvent('fit:add-widget', { detail: { kind } }));
        };
        item.addEventListener('click', handler);
        handlers.push(() => item.removeEventListener('click', handler));
      });
      return () => handlers.forEach(h => h());
    }, []);

    const registry = getRegistry();
    const items = registry.map(entry =>
      `<div class="palette-item" data-kind="${entry.kind}">
        <span>${entry.label}</span>
        <span class="tag">&lt;${entry.kind}&gt;</span>
      </div>`
    ).join('');

    return `
      <div class="section-title">Components</div>
      ${items}
    `;
  }
);
