import { Component, inject, signal, computed } from '@angular/core';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_CHIP } from '@progress/kendo-angular-buttons';
import { DialogComponent, DialogActionsComponent } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { pencilIcon, trashIcon } from '@progress/kendo-svg-icons';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { UserAvatarComponent } from '../../../shared/user-avatar/user-avatar.component';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-grid',
  imports: [
    ...KENDO_GRID,
    ...KENDO_BUTTON,
    ...KENDO_CHIP,
    DialogComponent,
    DialogActionsComponent,
    UserAvatarComponent,
    UserDialogComponent,
  ],
  providers: [NotificationService],
  host: { '(window:resize)': 'onResize()' },
  template: `
    <kendo-grid
      [kendoGridBinding]="users()"
      [height]="gridHeight()"
      [pageSize]="pageSize"
      [pageable]="true"
      [sortable]="true"
      [filterable]="'menu'"
      [resizable]="true"
      [rowClass]="rowClass"
      [dataLayoutMode]="isPhone() ? 'stacked' : 'columns'"
    >
      <ng-template kendoGridToolbarTemplate>
        <button kendoButton themeColor="primary" (click)="openAdd()">+ Add User</button>
      </ng-template>

      <kendo-grid-column field="photoUrl" title="Photo" [width]="64" [filterable]="false" [sortable]="false">
        <ng-template kendoGridCellTemplate let-dataItem>
          <app-user-avatar
            [firstName]="dataItem.firstName"
            [lastName]="dataItem.lastName"
            [photoUrl]="dataItem.photoUrl"
            size="36px"
          />
        </ng-template>
      </kendo-grid-column>

      <kendo-grid-column field="firstName" title="First Name" [width]="130" />
      <kendo-grid-column field="lastName" title="Last Name" [width]="130" />
      <kendo-grid-column field="email" title="Email" [width]="220" />

      <kendo-grid-column field="phone" title="Phone" [width]="150" [hidden]="isTablet()" />

      <kendo-grid-column field="teams" title="Teams" [width]="180" [filterable]="false" [sortable]="false" [hidden]="isTablet()">
        <ng-template kendoGridCellTemplate let-dataItem>
          <div class="teams-cell">
            @for (team of dataItem.teams; track team.id) {
              <span class="team-badge">{{ team.name }}</span>
            }
          </div>
        </ng-template>
      </kendo-grid-column>

      <kendo-grid-column field="role" title="Role" [width]="110" />

      <kendo-grid-column field="status" title="Status" [width]="110">
        <ng-template kendoGridCellTemplate let-dataItem>
          <kendo-chip
            [label]="dataItem.status"
            size="small"
            [themeColor]="dataItem.status === 'Active' ? 'success' : 'error'"
          />
        </ng-template>
      </kendo-grid-column>

      <kendo-grid-column title="Actions" [width]="isTablet() ? 90 : 160" [filterable]="false" [sortable]="false">
        <ng-template kendoGridCellTemplate let-dataItem>
          <div class="action-cell">
            <button
              kendoButton fillMode="outline" size="small" themeColor="primary"
              [svgIcon]="pencilIcon"
              (click)="openEdit(dataItem)"
              [attr.aria-label]="'Edit ' + dataItem.firstName + ' ' + dataItem.lastName"
            >
              <span class="action-label">Edit</span>
            </button>
            <button
              kendoButton fillMode="outline" size="small" themeColor="error"
              [svgIcon]="trashIcon"
              (click)="confirmDelete(dataItem)"
              [attr.aria-label]="'Delete ' + dataItem.firstName + ' ' + dataItem.lastName"
            >
              <span class="action-label">Delete</span>
            </button>
          </div>
        </ng-template>
      </kendo-grid-column>
    </kendo-grid>

    @if (dialogOpen()) {
      <app-user-dialog
        [user]="editingUser()"
        (saved)="onSaved($event)"
        (cancelled)="closeDialog()"
      />
    }

    @if (deleteTarget()) {
      <kendo-dialog
        title="Confirm Delete"
        [width]="400"
        (close)="deleteTarget.set(null)"
      >
        <p>
          Are you sure you want to permanently delete
          <strong>{{ deleteTarget()!.firstName }} {{ deleteTarget()!.lastName }}</strong>?
          This action cannot be undone.
        </p>
        <kendo-dialog-actions layout="end">
          <button kendoButton fillMode="outline" (click)="deleteTarget.set(null)">Cancel</button>
          <button kendoButton themeColor="error" (click)="executeDelete()">Delete</button>
        </kendo-dialog-actions>
      </kendo-dialog>
    }
  `,
  styles: [`
    /* ── Grid view ── */
    .teams-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .team-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.75rem;
      background: var(--kendo-color-base-subtle, #f0f0f0);
      color: var(--kendo-color-on-base, #333);
      white-space: nowrap;
    }

    .action-cell {
      display: flex;
      gap: 4px;
    }

    :host ::ng-deep .k-grid td {
      vertical-align: middle;
    }

    @media (max-width: 1024px) {
      .action-label { display: none; }
    }
  `],
})
export class UserGridComponent {
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);

  users = this.userService.users;
  pageSize = 20;

  dialogOpen = signal(false);
  editingUser = signal<User | null>(null);
  deleteTarget = signal<User | null>(null);

  readonly pencilIcon = pencilIcon;
  readonly trashIcon = trashIcon;

  private _width = signal(window.innerWidth);
  private _viewportHeight = signal(window.innerHeight);

  isPhone = computed(() => this._width() < 640);
  isTablet = computed(() => this._width() >= 640 && this._width() < 1024);

  gridHeight = computed(() => this._viewportHeight() - 225);

  onResize(): void {
    this._width.set(window.innerWidth);
    this._viewportHeight.set(window.innerHeight);
  }

  teamNames = (teams: User['teams']) => teams.map(t => t.name).join(', ');

  rowClass = (): string => '';

  openAdd(): void {
    this.editingUser.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(user: User): void {
    this.editingUser.set(user);
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingUser.set(null);
  }

  onSaved(payload: Omit<User, 'id'> & { id?: number }): void {
    if (payload.id != null) {
      this.userService.update(payload as User).subscribe(() => {
        this.notify('User updated successfully.', 'success');
      });
    } else {
      const { id: _id, ...rest } = payload as User;
      this.userService.add(rest).subscribe(() => {
        this.notify('User added successfully.', 'success');
      });
    }
    this.closeDialog();
  }

  confirmDelete(user: User): void {
    this.deleteTarget.set(user);
  }

  executeDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.userService.remove(target.id).subscribe(() => {
      this.notify(`${target.firstName} ${target.lastName} deleted.`, 'warning');
    });
    this.deleteTarget.set(null);
  }

  private notify(message: string, style: 'success' | 'warning' | 'error' | 'info'): void {
    this.notificationService.show({
      content: message,
      type: { style, icon: true },
      animation: { type: 'fade', duration: 300 },
      position: { horizontal: 'right', vertical: 'top' },
      hideAfter: 3000,
    });
  }
}
