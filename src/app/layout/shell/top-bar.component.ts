import { Component, output, input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KENDO_BUTTON, KENDO_DROPDOWNBUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { menuIcon, globeIcon, chevronDownIcon } from '@progress/kendo-svg-icons';
import { UserAvatarComponent } from '../../shared/user-avatar/user-avatar.component';
import { CURRENT_USER } from '../../core/data/mock-users';

@Component({
  selector: 'app-top-bar',
  imports: [...KENDO_BUTTON, ...KENDO_DROPDOWNBUTTON, ...KENDO_SVGICON, UserAvatarComponent],
  template: `
    <header class="top-bar" role="banner">
      <div class="top-bar__start">
        @if (showMenuToggle()) {
          <button
            kendoButton
            fillMode="flat"
            class="top-bar__menu-btn"
            (click)="menuToggle.emit()"
            aria-label="Toggle navigation menu"
          >
            <kendo-svg-icon [icon]="menuIcon" />
          </button>
        }
        <span class="top-bar__brand">UserHub</span>
      </div>

      <div class="top-bar__end">
        <button
          kendoButton
          fillMode="outline"
          size="small"
          [toggleable]="true"
          [selected]="navEnabled"
          (selectedChange)="onNavToggle($event)"
          class="top-bar__nav-toggle"
          [title]="navEnabled ? 'Hide sidebar navigation' : 'Show sidebar navigation'"
          [attr.aria-label]="navEnabled ? 'Hide sidebar navigation' : 'Show sidebar navigation'"
          [attr.aria-pressed]="navEnabled"
        >
          {{ navEnabled ? 'Hide Sidebar' : 'Show Sidebar' }}
        </button>

        <kendo-dropdownbutton
          [data]="languageItems"
          fillMode="flat"
          class="top-bar__lang"
          [popupSettings]="{ align: 'right' }"
          aria-label="Select language"
        >
          <kendo-svg-icon [icon]="globeIcon" />
          <span class="top-bar__lang-label">EN</span>
          <ng-template kendoDropDownButtonItemTemplate let-item>
            <span class="lang-item">
              <span>{{ item.flag }}</span>
              <span>{{ item.text }}</span>
              @if (item.noop) {
                <span class="lang-item__noop">noop</span>
              }
            </span>
          </ng-template>
        </kendo-dropdownbutton>

        <kendo-dropdownbutton
          [data]="profileMenuItems"
          fillMode="flat"
          class="top-bar__profile"
          [popupSettings]="{ align: 'right' }"
          aria-label="User menu"
        >
          <app-user-avatar
            [firstName]="currentUser.firstName"
            [lastName]="currentUser.lastName"
            [photoUrl]="currentUser.photoUrl"
            size="32px"
          />
          <span class="top-bar__username">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
          <kendo-svg-icon [icon]="chevronDownIcon" class="top-bar__chevron" />
          <ng-template kendoDropDownButtonItemTemplate let-item>
            <span [class.profile-item--danger]="item.danger">{{ item.text }}</span>
          </ng-template>
        </kendo-dropdownbutton>
      </div>
    </header>
  `,
  styles: [`
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      height: 56px;
      background: var(--kendo-color-primary, #0078d4);
      color: #fff;
      flex-shrink: 0;
      gap: 8px;
    }

    .top-bar__start,
    .top-bar__end {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .top-bar__brand {
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      color: #fff;
    }

    /* Make flat buttons readable on the primary background */
    .top-bar :is(button[kendoButton], kendo-dropdownbutton) {
      color: #fff !important;
    }

    .top-bar__menu-btn {
      color: #fff;
    }

    .top-bar__nav-toggle {
      font-size: 0.8rem;
      border-color: rgba(255,255,255,0.5) !important;
      color: #fff !important;
    }

    .top-bar__lang {
      display: flex;
      align-items: center;
    }

    .top-bar__lang-label {
      margin-left: 6px;
      font-weight: 500;
    }

    .top-bar__profile {
      display: flex;
      align-items: center;
    }

    .top-bar__username {
      margin-left: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .top-bar__chevron {
      margin-left: 4px;
      opacity: 0.7;
    }

    /* Dropdown item templates */
    .lang-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .lang-item__noop {
      margin-left: auto;
      font-size: 0.7rem;
      opacity: 0.5;
      font-style: italic;
    }

    .profile-item--danger {
      color: var(--kendo-color-error, #d32f2f);
    }

    @media (max-width: 600px) {
      .top-bar__username,
      .top-bar__nav-toggle {
        display: none;
      }
    }
  `],
})
export class TopBarComponent implements OnInit {
  showMenuToggle = input<boolean>(true);
  menuToggle = output<void>();

  readonly menuIcon = menuIcon;
  readonly globeIcon = globeIcon;
  readonly chevronDownIcon = chevronDownIcon;
  readonly currentUser = CURRENT_USER;

  navEnabled = true;

  readonly languageItems = [
    { text: 'English', flag: '🇬🇧' },
    { text: 'German', flag: '🇩🇪', noop: true },
    { text: 'French', flag: '🇫🇷', noop: true },
    { text: 'Spanish', flag: '🇪🇸', noop: true },
  ];

  readonly profileMenuItems = [
    { text: 'My Profile' },
    { text: 'Account Settings' },
    { text: 'Notifications' },
    { text: 'Help & Support' },
    { text: 'Sign Out', danger: true },
  ];

  private router = inject(Router);

  ngOnInit(): void {
    this.navEnabled = !this.router.url.startsWith('/no-drawer');
  }

  onNavToggle(enabled: boolean): void {
    this.navEnabled = enabled;
    this.router.navigate([enabled ? '/' : '/no-drawer']);
  }
}
