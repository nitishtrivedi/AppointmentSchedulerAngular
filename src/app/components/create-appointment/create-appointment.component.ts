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
import { NgFor, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { DepartmentsService } from '../../services/departments.service';
import { Service } from '../../models/ServiceModel';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/EmployeeModel';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-create-appointment',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        FormsModule,
        NgIf,
    ],
    templateUrl: './create-appointment.component.html',
    styleUrl: './create-appointment.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAppointmentComponent implements OnInit {
    userFullname: string = '';
    services: Service[] = [];
    employees: Employee[] = [];

    isServiceSelected: boolean = false;
    isEmpAvailable: boolean = false;
    assignedEmployee: Employee;

    isAssignedEmployeeAvailableOnSelectedDate: boolean = false;

    //FORM DATA
    selectedApptDate: string = '';
    selectedServiceID: string = '';
    userId: number;
    formattedDate: string = '';

    constructor(
        private userService: UserService,
        private cdRef: ChangeDetectorRef,
        private serviceService: DepartmentsService,
        private employeeService: EmployeeService
    ) {}
    ngOnInit(): void {
        const uid = localStorage.getItem('currentUserId');
        if (uid !== null) {
            this.userId = parseInt(uid);
            this.getUserById(uid);
            this.getServices();
            this.getEmployees();
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
    async getEmployees() {
        (await this.employeeService.getEmployees()).subscribe((data) => {
            this.employees = data;
        });
    }

    checkIfEmpAvailable() {
        this.isServiceSelected = true;
        const serviceName = this.getServiceNameBySID(
            parseInt(this.selectedServiceID)
        );
        const availableEmployees = this.employees.filter(
            (employee) => employee.employeeService === serviceName
        );
        this.isEmpAvailable = availableEmployees.some(
            (emp) => emp.isAvailable === true
        );
        const availableEmployee = availableEmployees.find(
            (emp) => emp.isAvailable === true
        );
        this.isEmpAvailable = !!availableEmployee;
        if (this.isEmpAvailable && availableEmployee !== undefined) {
            this.assignedEmployee = availableEmployee;
        }
        //CHECK BASED ON THE SELECTED DATE BY THE USER
        this.checkEmployeeAvailability(
            this.assignedEmployee,
            this.formattedDate
        );
    }

    checkEmployeeAvailability(employee: Employee, selectedDate: string) {
        if (this.formattedDate !== '') {
            var empApptDates: string[] = employee.appointments.map(
                (appt) => appt.date
            );
            this.isAssignedEmployeeAvailableOnSelectedDate = empApptDates.some(
                (appt) => appt == selectedDate
            );
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Please select a date first',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
        // console.log(
        //     `Assigned Emp Available: ${this.isAssignedEmployeeAvailableOnSelectedDate}, Service Selected: ${this.isServiceSelected}, Employee Available:${this.isEmpAvailable}`
        // );
    }

    getServiceNameBySID(serviceId: number) {
        const serviceName = this.services.find(
            (service) => service.serviceId === serviceId
        );
        return serviceName ? serviceName.serviceName : null;
    }

    checkApptDate() {
        this.formattedDate = this.getFormattedDate(this.selectedApptDate);
    }

    getFormattedDate(date: any) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return month + '/' + day + '/' + year;
    }
}
