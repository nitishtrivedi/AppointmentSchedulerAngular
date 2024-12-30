import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  userFirstName: string = '';
  currentUser: User | undefined;

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    const uid = localStorage.getItem('currentUserId');
    if (uid !== null) {
      const intUID = parseInt(uid);
      this.userService.getUser(intUID).subscribe((user) => {
        this.currentUser = user;
        this.userFirstName = this.currentUser.userFirstName;
      });
    } else {
      this.userFirstName = '';
    }
  }
}
