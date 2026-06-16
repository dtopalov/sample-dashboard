import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../shell/top-bar.component';

@Component({
  selector: 'app-no-drawer',
  imports: [RouterOutlet, TopBarComponent],
  template: `
    <div class="shell">
      <app-top-bar [showMenuToggle]="false" />
      <main class="main-content" id="main-content" tabindex="-1">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      outline: none;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 12px;
      }
    }
  `],
})
export class NoDrawerComponent {}
