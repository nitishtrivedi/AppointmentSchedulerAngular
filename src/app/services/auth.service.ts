import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageKey = 'isAuthenticated';

  private currentUserIDKey = 'currentUserId';
  private authSubject = new BehaviorSubject<boolean>(this.getstoredAuthstate());
  private currentUserIdSubject = new BehaviorSubject<number | null>(
    this.getStoredUserId()
  );
  public authState$ = this.authSubject.asObservable();
  public currentUserId$ = this.currentUserIdSubject.asObservable();

  constructor() {}

  private getStoredUserId(): number | null {
    const storedId = localStorage.getItem(this.currentUserIDKey);
    return storedId ? parseInt(storedId) : null;
  }
  private getstoredAuthstate(): boolean {
    const storedAuthState = localStorage.getItem(this.storageKey);
    return storedAuthState === 'true';
  }

  login(
    usernameInput: string,
    passwordInput: string,
    usernameDB: string,
    passwordDB: string,
    userId: number
  ): boolean {
    if (usernameInput === usernameDB && passwordInput === passwordDB) {
      localStorage.setItem(this.storageKey, 'true');
      this.setCurrentUserId(userId);
      this.authSubject.next(true);
      this.currentUserIdSubject.next(userId);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.currentUserIDKey);
    this.authSubject.next(false);
    this.currentUserIdSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.authSubject.getValue();
  }

  setCurrentUserId(uid: number) {
    localStorage.setItem(this.currentUserIDKey, uid.toString());
    this.currentUserIdSubject.next(uid);
  }
}
