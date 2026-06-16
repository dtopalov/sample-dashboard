import { Component } from '@angular/core';
import { KENDO_TABSTRIP } from '@progress/kendo-angular-layout';
import { UserGridComponent } from './user-grid/user-grid.component';
import { ComingSoonComponent } from './tabs/coming-soon.component';

const TABS = [
  'Roles & Permissions',
  'Security',
  'Activity Logs',
  'Invitations',
  'Teams',
  'Workplace Policies',
  "Who's In",
] as const;

@Component({
  selector: 'app-users',
  imports: [...KENDO_TABSTRIP, UserGridComponent, ComingSoonComponent],
  template: `
    <kendo-tabstrip [scrollable]="true" [animate]="false">
      <kendo-tabstrip-tab title="All Users" [selected]="true">
        <ng-template kendoTabContent>
          <div class="tab-content">
            <app-user-grid />
          </div>
        </ng-template>
      </kendo-tabstrip-tab>

      @for (tab of tabs; track tab) {
        <kendo-tabstrip-tab [title]="tab">
          <ng-template kendoTabContent>
            <div class="tab-content">
              <app-coming-soon [label]="tab" />
            </div>
          </ng-template>
        </kendo-tabstrip-tab>
      }
    </kendo-tabstrip>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .tab-content {
      padding: 20px 0 0;
    }
  `],
})
export class UsersComponent {
  readonly tabs = TABS;
}
