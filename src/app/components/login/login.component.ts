import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/UserModel';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  userId: string = '';
  password: string = '';
  users: User[] = [];
  userIdDB: string = '';
  passwordDB: string = '';

  private _snackBar = inject(MatSnackBar);

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      console.log(this.users);
    });
  }
  validateUID(uid: string): boolean {
    return this.users.some((u) => u.userName == uid);
  }

  validatePWD(pwd: string): boolean {
    return this.users.some((u) => u.userPassword == pwd);
  }
  submitLogin() {
    var uid = this.userId;
    var pwd = this.password;

    var isUidCorrect = this.validateUID(uid);
    var isPWDCorrect = this.validatePWD(pwd);

    if (isUidCorrect && isPWDCorrect) {
      var isAuthenticated = this.authService.login(uid, pwd, uid, pwd);
      if (isAuthenticated) {
        this._snackBar.open('', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
        this.router.navigate(['/home']);
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'UserID or Password is Incorrect. Please try again',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
}
