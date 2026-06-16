import { Injectable, signal, computed } from '@angular/core';
import { of, Observable, delay } from 'rxjs';
import { User } from '../models/user.model';
import { MOCK_USERS } from '../data/mock-users';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _users = signal<User[]>(structuredClone(MOCK_USERS));
  private _nextId = MOCK_USERS.length + 1;

  readonly users = this._users.asReadonly();
  readonly total = computed(() => this._users().length);

  getAll(): Observable<User[]> {
    return of(this._users()).pipe(delay(150));
  }

  add(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = { ...user, id: this._nextId++ };
    this._users.update(list => [...list, newUser]);
    return of(newUser).pipe(delay(150));
  }

  update(updated: User): Observable<User> {
    this._users.update(list =>
      list.map(u => (u.id === updated.id ? { ...updated } : u))
    );
    return of(updated).pipe(delay(150));
  }

  remove(id: number): Observable<void> {
    this._users.update(list => list.filter(u => u.id !== id));
    return of(undefined).pipe(delay(150));
  }
}
