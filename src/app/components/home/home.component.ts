import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { NgIf } from '@angular/common';
import { AppointmentListComponent } from '../appointment-list/appointment-list.component';
import { Appointment } from '../../models/AppointmentModel';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [NgIf, AppointmentListComponent, MatButton],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
    userFirstName: string = '';
    currentUser: User | undefined;
    hasAppointments: boolean = false;

    appointmentIDs: number[] = [];

    constructor(private userService: UserService, private router: Router) {}
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

                //Check for appointments
                if (this.currentUser.appointments.length > 0) {
                    this.hasAppointments = true;
                    this.currentUser.appointments.forEach((appointment) => {
                        if (appointment.AppointmentId) {
                            this.appointmentIDs.push(appointment.AppointmentId);
                        }
                    });
                } else {
                    this.hasAppointments = false;
                }
            });
        } else {
            this.userFirstName = '';
        }
    }

    scheduleAppt() {
        this.router.navigate(['/create-appointment']);
    }
}
