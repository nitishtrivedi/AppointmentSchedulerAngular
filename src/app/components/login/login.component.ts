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
  currentUser: User | undefined;
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

  //#region User Details Code
  getUserDetails() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
  validateUID(uid: string): boolean {
    return this.users.some((u) => u.userName == uid);
  }
  validatePWD(pwd: string): boolean {
    return this.users.some((u) => u.userPassword == pwd);
  }

  getUserByID(uid: string): User | undefined {
    return this.users.find((u) => u.userName === uid);
  }

  //#endregion

  submitLogin() {
    var uid = this.userId;
    var pwd = this.password;

    var isUidCorrect = this.validateUID(uid);
    var isPWDCorrect = this.validatePWD(pwd);

    if (isUidCorrect && isPWDCorrect) {
      this.currentUser = this.getUserByID(uid);
      if (this.currentUser) {
        var isAuthenticated = this.authService.login(
          uid,
          pwd,
          uid,
          pwd,
          this.currentUser.userId
        );
        if (isAuthenticated) {
          this._snackBar.open(
            `${this.currentUser.userFirstName} ${this.currentUser.userLastName} logged in!`,
            'Dismiss',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            }
          );
          this.router.navigate(['/home']);
        }
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
