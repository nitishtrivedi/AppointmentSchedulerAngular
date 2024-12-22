import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [ButtonModule, NgIf],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
    isLoggedIn: boolean = false;
    constructor(private authService: AuthService, private router: Router) {}
    ngOnInit(): void {
        this.authService.authState$.subscribe((auth) => {
            this.isLoggedIn = auth;
            console.log(this.isLoggedIn);
        });
    }

    logoutUser() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
