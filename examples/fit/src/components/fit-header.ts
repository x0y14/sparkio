import { defineElement, css, useState, useHost, useEffect } from '@sparkio/core';

defineElement(
  {
    tag: 'fit-header',
    styles: css`
      @unocss-placeholder
      :host {
        @apply "flex items-center h-12 px-4 gap-3 z-20 box-border";
        background-color: #2d2d44;
        border-bottom: 1px solid #3a3a5c;
      }
      .spacer {
        @apply "flex-1";
      }
      .mode-toggle {
        @apply "flex items-center rounded-lg overflow-hidden";
        background-color: #1a1a2e;
        padding: 2px;
        gap: 2px;
      }
      .mode-btn {
        @apply "flex items-center gap-1.5 px-3 h-7 text-xs font-medium rounded-md border-none cursor-pointer select-none";
        background-color: transparent;
        color: #888;
        transition: all 0.2s ease;
      }
      .mode-btn:hover {
        color: #ccc;
      }
      .mode-btn.active {
        background-color: #8b8bff;
        color: #fff;
        box-shadow: 0 1px 4px rgba(139, 139, 255, 0.3);
      }
      .mode-btn.active:hover {
        background-color: #7a7aee;
      }
      .mode-btn svg {
        @apply "w-3.5 h-3.5";
      }
    `,
  },
  () => {
    const [mode, setMode] = useState<string>("edit");
    const hostRef = useHost();

    useEffect(() => {
      const root = hostRef.current.shadowRoot;
      if (!root) return;
      const buttons = root.querySelectorAll('.mode-btn');
      const handlers: Array<() => void> = [];
      buttons.forEach(btn => {
        const handler = () => {
          const newMode = (btn as HTMLElement).dataset.mode;
          if (newMode && newMode !== mode) {
            setMode(newMode);
            window.dispatchEvent(new CustomEvent('fit:mode-change', { detail: { mode: newMode } }));
          }
        };
        btn.addEventListener('click', handler);
        handlers.push(() => btn.removeEventListener('click', handler));
      });
      return () => handlers.forEach(h => h());
    }, [mode]);

    const editIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
    const previewIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

    return `
      <span class="logo font-bold text-sm text-accent select-none">Fit</span>
      <span class="w-px h-6 bg-border"></span>
      <span class="text-xs text-muted px-2 py-1">Component Fitting Demo</span>
      <span class="spacer"></span>
      <div class="mode-toggle">
        <button class="mode-btn ${mode === 'edit' ? 'active' : ''}" data-mode="edit">${editIcon}<span>Edit</span></button>
        <button class="mode-btn ${mode === 'preview' ? 'active' : ''}" data-mode="preview">${previewIcon}<span>Preview</span></button>
      </div>
    `;
  }
);
