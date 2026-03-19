import { defineElement, css, useHost, useEffect } from '@sparkio/core';
import { WidgetStore } from '../lib/widgets/widget-store';
import { Scene } from '../lib/scene/scene';
import '../lib/ui-imports';

defineElement(
  {
    tag: 'fit-canvas',
    styles: css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      .canvas-container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background-color: #1a1a2e;
        background-image:
          repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px);
        background-size: 20px 20px;
      }
    `,
  },
  () => {
    const hostRef = useHost();

    useEffect(() => {
      const root = hostRef.current.shadowRoot;
      if (!root) return;
      const container = root.querySelector('.canvas-container') as HTMLElement;
      if (!container) return;

      const store = new WidgetStore();
      const scene = new Scene(container, store);

      return () => scene.destroy();
    }, []);

    return `<div class="canvas-container"></div>`;
  }
);
