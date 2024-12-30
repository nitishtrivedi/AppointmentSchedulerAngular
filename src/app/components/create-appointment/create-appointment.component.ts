import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { DepartmentsService } from '../../services/departments.service';
import { Service } from '../../models/ServiceModel';

@Component({
  selector: 'app-create-appointment',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAppointmentComponent implements OnInit {
  userFullname: string = '';
  services: Service[] = [];

  constructor(
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private serviceService: DepartmentsService
  ) {}
  ngOnInit(): void {
    const uid = localStorage.getItem('currentUserId');
    if (uid !== null) {
      this.getUserById(uid);
      this.getServices();
    }
  }

  getUserById(uid: string) {
    const numUID = parseInt(uid);
    this.userService.getUser(numUID).subscribe((data) => {
      this.userFullname = `${data.userFirstName} ${data.userLastName}`;
      this.cdRef.markForCheck();
    });
  }

  async getServices() {
    (await this.serviceService.getServices()).subscribe((data) => {
      this.services = data;
    });
  }
}
