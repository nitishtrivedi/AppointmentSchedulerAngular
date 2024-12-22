import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, InputTextModule, ButtonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
    userId: string = '';
    password: string = '';

    users: User[] = [];
    userIdDB: string = '';

    passwordDB: string = '';
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router
    ) {}
    ngOnInit(): void {
        this.getUserDetails();
    }

    submitUserLogin() {
        var uid = this.userId;
        var pwd = this.password;

        var isUidCorrect = this.validateUID(uid);
        var isPWDCorrect = this.validatePWD(pwd);

        if (isUidCorrect && isPWDCorrect) {
            var isAuthenticated = this.authService.login(uid, pwd, uid, pwd);
            if (isAuthenticated) {
                this.router.navigate(['/home']);
            }
        } else {
            console.log('Access Denied');
        }
    }

    validateUID(uid: string): boolean {
        return this.users.some((u) => u.userName == uid);
    }

    validatePWD(pwd: string): boolean {
        return this.users.some((u) => u.userPassword == pwd);
    }

    getUserDetails() {
        this.userService.getUsers().subscribe((data) => {
            this.users = data;
            //console.log(this.users);
        });
    }
}
