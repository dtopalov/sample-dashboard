import { Component, inject, output, input, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogComponent, DialogActionsComponent } from '@progress/kendo-angular-dialog';
import { KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { KENDO_MULTISELECT } from '@progress/kendo-angular-dropdowns';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_UPLOAD, UploadEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import { User, UserRole, UserStatus } from '../../../core/models/user.model';
import { Team } from '../../../core/models/team.model';
import { MOCK_TEAMS } from '../../../core/data/mock-teams';

@Component({
  selector: 'app-user-dialog',
  imports: [
    ReactiveFormsModule,
    DialogComponent,
    DialogActionsComponent,
    ...KENDO_TEXTBOX,
    ...KENDO_LABEL,
    ...KENDO_DROPDOWNLIST,
    ...KENDO_MULTISELECT,
    ...KENDO_BUTTON,
    ...KENDO_UPLOAD,
  ],
  template: `
    <kendo-dialog
      [title]="user() ? 'Edit User: ' + user()!.firstName + ' ' + user()!.lastName : 'Add User'"
      [width]="560"
      (close)="onCancel()"
    >
      <form [formGroup]="form" class="user-form" (ngSubmit)="onSave()">
        <div class="user-form__row">
          <div class="user-form__field">
            <kendo-label [for]="firstNameInput" text="First Name *" />
            <kendo-textbox
              #firstNameInput
              formControlName="firstName"
              placeholder="First name"
              [attr.aria-required]="true"
            />
            @if (form.controls.firstName.invalid && form.controls.firstName.touched) {
              <span class="user-form__error" role="alert">First name is required</span>
            }
          </div>
          <div class="user-form__field">
            <kendo-label [for]="lastNameInput" text="Last Name *" />
            <kendo-textbox
              #lastNameInput
              formControlName="lastName"
              placeholder="Last name"
              [attr.aria-required]="true"
            />
            @if (form.controls.lastName.invalid && form.controls.lastName.touched) {
              <span class="user-form__error" role="alert">Last name is required</span>
            }
          </div>
        </div>

        <div class="user-form__field">
          <kendo-label [for]="emailInput" text="Email *" />
          <kendo-textbox
            #emailInput
            formControlName="email"
            placeholder="email@company.com"
            inputType="email"
            [attr.aria-required]="true"
          />
          @if (form.controls.email.invalid && form.controls.email.touched) {
            <span class="user-form__error" role="alert">
              @if (form.controls.email.errors?.['required']) { Email is required }
              @else { Enter a valid email address }
            </span>
          }
        </div>

        <div class="user-form__field">
          <kendo-label [for]="phoneInput" text="Phone" />
          <kendo-textbox
            #phoneInput
            formControlName="phone"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div class="user-form__row">
          <div class="user-form__field">
            <kendo-label text="Role *" />
            <kendo-dropdownlist
              formControlName="role"
              [data]="roles"
              [attr.aria-required]="true"
            />
          </div>
          <div class="user-form__field">
            <kendo-label text="Status *" />
            <kendo-dropdownlist
              formControlName="status"
              [data]="statuses"
              [attr.aria-required]="true"
            />
          </div>
        </div>

        <div class="user-form__field">
          <kendo-label text="Teams" />
          <kendo-multiselect
            formControlName="teams"
            [data]="availableTeams"
            textField="name"
            valueField="id"
            placeholder="Select teams..."
          />
        </div>

        <div class="user-form__field">
          <kendo-label text="Photo" />
          <kendo-upload
            [saveUrl]="uploadSaveUrl"
            [restrictions]="fileRestrictions"
            [multiple]="false"
            (upload)="onUpload($event)"
          />
          @if (photoPreview()) {
            <img [src]="photoPreview()!" alt="Photo preview" class="user-form__photo-preview" />
          }
        </div>
      </form>

      <kendo-dialog-actions layout="end">
        <button kendoButton fillMode="outline" (click)="onCancel()">Cancel</button>
        <button
          kendoButton
          themeColor="primary"
          [disabled]="form.invalid || saving()"
          (click)="onSave()"
        >
          {{ saving() ? 'Saving…' : 'Save' }}
        </button>
      </kendo-dialog-actions>
    </kendo-dialog>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }

    .user-form__row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .user-form__field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-form__error {
      font-size: 0.8rem;
      color: var(--kendo-color-error, #d32f2f);
    }

    .user-form__photo-preview {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 50%;
      margin-top: 8px;
      border: 2px solid var(--kendo-color-border, #e0e0e0);
    }

    @media (max-width: 480px) {
      .user-form__row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class UserDialogComponent implements OnInit {
  user = input<User | null>(null);
  saved = output<Omit<User, 'id'> & { id?: number }>();
  cancelled = output<void>();

  private fb = inject(FormBuilder);

  readonly roles: UserRole[] = ['Admin', 'Manager', 'User'];
  readonly statuses: UserStatus[] = ['Active', 'Inactive'];
  readonly availableTeams: Team[] = MOCK_TEAMS;
  readonly uploadSaveUrl = '/api/upload';
  readonly fileRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    maxFileSize: 5_000_000,
  };

  saving = signal(false);
  photoPreview = signal<string | null>(null);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    role: ['User' as UserRole, Validators.required],
    status: ['Active' as UserStatus, Validators.required],
    teams: [[] as Team[]],
    photoUrl: [null as string | null],
  });

  ngOnInit(): void {
    const u = this.user();
    if (u) {
      this.form.setValue({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status,
        teams: u.teams,
        photoUrl: u.photoUrl,
      });
      if (u.photoUrl) {
        this.photoPreview.set(u.photoUrl);
      }
    }
  }

  onUpload(event: UploadEvent): void {
    const file = event.files[0]?.rawFile;
    if (file) {
      const url = URL.createObjectURL(file);
      this.photoPreview.set(url);
      this.form.patchValue({ photoUrl: url });
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const payload = {
      ...(this.user() ? { id: this.user()!.id } : {}),
      firstName: value.firstName!,
      lastName: value.lastName!,
      email: value.email!,
      phone: value.phone ?? '',
      role: value.role as UserRole,
      status: value.status as UserStatus,
      teams: (value.teams as Team[]) ?? [],
      photoUrl: value.photoUrl ?? null,
    };

    this.saved.emit(payload as Omit<User, 'id'> & { id?: number });
    this.saving.set(false);
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
