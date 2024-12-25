import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageKey = 'isAuthenticated';
  private authSubject = new BehaviorSubject<boolean>(this.getstoredAuthstate());
  public authState$ = this.authSubject.asObservable();

  constructor() {}

  private getstoredAuthstate(): boolean {
    const storedAuthState = localStorage.getItem(this.storageKey);
    return storedAuthState === 'true';
  }

  login(
    usernameInput: string,
    passwordInput: string,
    usernameDB: string,
    passwordDB: string
  ): boolean {
    if (usernameInput === usernameDB && passwordInput === passwordDB) {
      localStorage.setItem(this.storageKey, 'true');
      this.authSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.authSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.authSubject.getValue();
  }
}
