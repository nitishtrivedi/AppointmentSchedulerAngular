import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isAuthenticated = false;

    constructor() {}

    login(
        usernameInput: string,
        passwordInput: string,
        usernameDB: string,
        passwordDB: string
    ): boolean {
        if (usernameInput === usernameDB && passwordInput === passwordDB) {
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }

    logout(): void {
        this.isAuthenticated = false;
    }

    isLoggedIn(): boolean {
        return this.isAuthenticated;
    }
}
