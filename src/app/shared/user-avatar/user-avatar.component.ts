import { Component, input, computed } from '@angular/core';
import { KENDO_AVATAR } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-user-avatar',
  imports: [...KENDO_AVATAR],
  template: `
    <kendo-avatar
      [initials]="photoUrl() ? '' : initials()"
      [imageSrc]="photoUrl() ?? ''"
      [width]="size()"
      [height]="size()"
      shape="circle"
    />
  `,
})
export class UserAvatarComponent {
  firstName = input.required<string>();
  lastName = input.required<string>();
  photoUrl = input<string | null>(null);
  size = input<string>('32px');

  initials = computed(() =>
    `${this.firstName().charAt(0)}${this.lastName().charAt(0)}`.toUpperCase()
  );
}
