import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/UserModel';
import { UserService } from '../../services/user.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [MatButtonModule, NgIf, MatMenuModule, RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated: boolean = false;
    userFullName: string = '';
    user: User | undefined;
    private subscriptions: Subscription[] = [];
    constructor(
        private auth: AuthService,
        private userService: UserService,
        private router: Router
    ) {}
    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
    ngOnInit(): void {
        // Combine both auth state and user ID observables
        this.subscriptions.push(
            combineLatest([
                this.auth.authState$,
                this.auth.currentUserId$,
            ]).subscribe(([isAuthenticated, userId]) => {
                this.isAuthenticated = isAuthenticated;
                if (isAuthenticated && userId) {
                    this.getUserDetails(userId.toString());
                } else {
                    this.userFullName = '';
                    this.user = undefined;
                }
            })
        );
    }

    getUserDetails(uid: string) {
        const numUID: number = parseInt(uid);
        this.userService.getUser(numUID).subscribe((data) => {
            this.user = data;
            this.userFullName = `${this.user.userFirstName} ${this.user.userLastName}`;
        });
    }

    logoutUser() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
