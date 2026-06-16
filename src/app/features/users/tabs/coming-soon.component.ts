import { Component, input } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  template: `
    <div class="coming-soon" role="status">
      <p class="coming-soon__label">{{ label() }}</p>
      <span class="coming-soon__badge">Coming soon</span>
    </div>
  `,
  styles: [`
    .coming-soon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      gap: 12px;
      color: var(--kendo-color-subtle-text, #888);
    }

    .coming-soon__label {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .coming-soon__badge {
      font-size: 0.75rem;
      background: var(--kendo-color-base-subtle, #f0f0f0);
      padding: 2px 10px;
      border-radius: 12px;
    }
  `],
})
export class ComingSoonComponent {
  label = input<string>('This section');
}
