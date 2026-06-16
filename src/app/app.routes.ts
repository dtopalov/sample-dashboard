import { Routes } from '@angular/router';

const contentChildren: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/users.component').then(m => m.UsersComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/users/tabs/coming-soon.component').then(m => m.ComingSoonComponent),
    data: { label: 'Dashboard' },
  },
  {
    path: 'system',
    loadComponent: () =>
      import('./features/users/tabs/coming-soon.component').then(m => m.ComingSoonComponent),
    data: { label: 'System' },
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/users/tabs/coming-soon.component').then(m => m.ComingSoonComponent),
    data: { label: 'Settings' },
  },
];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/with-drawer/with-drawer.component').then(m => m.WithDrawerComponent),
    children: contentChildren,
  },
  {
    path: 'no-drawer',
    loadComponent: () =>
      import('./layout/no-drawer/no-drawer.component').then(m => m.NoDrawerComponent),
    children: contentChildren,
  },
  { path: '**', redirectTo: '' },
];
