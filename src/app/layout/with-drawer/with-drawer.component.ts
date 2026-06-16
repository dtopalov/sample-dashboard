import { Component, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { KENDO_DRAWER } from '@progress/kendo-angular-layout';
import { SVGIcon } from '@progress/kendo-svg-icons';
import { gridIcon, gearIcon, listUnorderedIcon, homeIcon } from '@progress/kendo-svg-icons';
import { TopBarComponent } from '../shell/top-bar.component';
import { DrawerItem, DrawerSelectEvent } from '@progress/kendo-angular-layout';

interface NavItem extends DrawerItem {
  path: string;
  svgIcon: SVGIcon;
}

@Component({
  selector: 'app-with-drawer',
  imports: [RouterOutlet, ...KENDO_DRAWER, TopBarComponent],
  host: { '(window:resize)': 'onResize()' },
  template: `
    <div class="shell">
      <app-top-bar [showMenuToggle]="true" (menuToggle)="toggleDrawer()" />

      <div class="shell__body">
        <kendo-drawer-container>
          <kendo-drawer
            [items]="navItems()"
            [expanded]="drawerExpanded()"
            [mode]="drawerMode()"
            [mini]="true"
            [miniWidth]="50"
            [width]="150"
            (expandedChange)="drawerExpanded.set($event)"
            (select)="onSelect($event)"
          />

          <kendo-drawer-content>
            <main class="main-content" id="main-content" tabindex="-1">
              <router-outlet />
            </main>
          </kendo-drawer-content>
        </kendo-drawer-container>
      </div>
    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
    }

    .shell__body {
      display: flex;
      flex: 1;
      min-height: 0;
      width: 100%;
    }

    kendo-drawer-container {
      flex: 1;
      width: 100%;
    }

    :host ::ng-deep .k-drawer {
      background: var(--kendo-color-base-subtle, #f5f5f5);
      border-right: 1px solid var(--kendo-color-border, #e0e0e0);
    }

    :host ::ng-deep .k-drawer-content {
      overflow: auto !important;
    }

    .main-content {
      padding: 24px;
      outline: none;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 12px 12px 12px 62px;
      }
    }
  `],
})
export class WithDrawerComponent {
  private router = inject(Router);

  drawerExpanded = signal(window.innerWidth >= 768);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  private static readonly baseItems: NavItem[] = [
    { text: 'Dashboard', path: '/dashboard', svgIcon: homeIcon },
    { text: 'Users', path: '/users', svgIcon: gridIcon },
    { text: 'System', path: '/system', svgIcon: listUnorderedIcon },
    { text: 'Settings', path: '/settings', svgIcon: gearIcon },
  ];

  navItems = computed<NavItem[]>(() => {
    const url = this.currentUrl() ?? '';
    return WithDrawerComponent.baseItems.map(item => ({
      ...item,
      selected: url.startsWith(item.path),
    }));
  });

  drawerMode = computed<'push' | 'overlay'>(() =>
    this.isMobile() ? 'overlay' : 'push'
  );


  private isMobile = signal(window.innerWidth < 768);

  onResize(): void {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);
    if (mobile) {
      this.drawerExpanded.set(false);
    }
  }

  toggleDrawer(): void {
    this.drawerExpanded.update(v => !v);
  }

  onSelect(event: DrawerSelectEvent): void {
    const item = event.item as NavItem;
    this.router.navigate([item.path]);
    if (this.isMobile()) {
      this.drawerExpanded.set(false);
    }
  }
}
