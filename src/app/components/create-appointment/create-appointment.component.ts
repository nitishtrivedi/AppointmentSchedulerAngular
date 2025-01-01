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
import { NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { DepartmentsService } from '../../services/departments.service';
import { Service } from '../../models/ServiceModel';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/EmployeeModel';
import Swal from 'sweetalert2';
import { AvailabilityRequest } from '../../models/AvailabilityRequestModel';
import {
    EmployeeAvailabilityService,
    UpdateAvailabilityRequest,
} from '../../services/employee-availability.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/AppointmentModel';

@Component({
    selector: 'app-create-appointment',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        FormsModule,
        NgIf,
        MatProgressSpinnerModule,
        MatButtonModule,
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
    serviceAvailableText: string = '';
    serviceAvailableClass: string = '';
    avlRequest: AvailabilityRequest;
    isAnyEmployeeAvailable: boolean;
    loading: boolean = false;
    submitting: boolean;

    //FORM DATA
    selectedApptDate: string = '';
    selectedServiceID: string = '';
    userId: number;
    formattedDate: string = '';
    serviceDescription: string = '';
    randomEmployee: Employee;

    constructor(
        private userService: UserService,
        private cdRef: ChangeDetectorRef,
        private serviceService: DepartmentsService,
        private employeeService: EmployeeService,
        private empAvailabilityService: EmployeeAvailabilityService,
        private appointmentService: AppointmentService
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

    async checkIfEmpAvailable() {
        this.isServiceSelected = true;
        this.loading = true;
        const serviceName = this.getServiceNameBySID(
            parseInt(this.selectedServiceID)
        );
        const availableEmployees = this.employees.filter(
            (employee) => employee.employeeService === serviceName
        );

        const serviceID = parseInt(this.selectedServiceID);
        const selectedDate = this.formattedDate;
        if (selectedDate !== '') {
            const availEmpsCheck = availableEmployees.map((emp) => {
                return this.getEmployeeAvailability(
                    emp.employeeId,
                    serviceID,
                    selectedDate
                );
            });
            const availabilityResults = await Promise.all(availEmpsCheck);
            this.isAnyEmployeeAvailable = availabilityResults.some(
                (res) => res === true
            );

            if (availabilityResults.some((isAvl) => isAvl === true)) {
                this.randomEmployee =
                    availableEmployees[
                        Math.floor(Math.random() * availableEmployees.length)
                    ];
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Please select a date first',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
        this.loading = false;
        this.cdRef.markForCheck(); // Use for automatic updating of things
    }

    async getEmployeeAvailability(
        empID: number,
        servID: number,
        inputDate: string
    ): Promise<boolean> {
        this.avlRequest = {
            employeeId: empID,
            serviceId: servID,
            date: inputDate,
        };

        return new Promise<boolean>(async (resolve, reject) => {
            (
                await this.empAvailabilityService.checkAvailability(
                    this.avlRequest
                )
            ).subscribe((data) => {
                resolve(data.isAvailable === true);
            });
        });
    }

    checkEmployeeAvailability(employee: Employee, selectedDate: string) {
        if (this.formattedDate !== '') {
            var empApptDates: string[] = employee.appointments.map(
                (appt) => appt.Date
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
        this.serviceAvailabilityText();
        // console.log(
        //     `Assigned Emp Available: ${this.isAssignedEmployeeAvailableOnSelectedDate}, Service Selected: ${this.isServiceSelected}`
        // );
    }

    serviceAvailabilityText() {
        if (
            this.isAssignedEmployeeAvailableOnSelectedDate &&
            this.isServiceSelected
        ) {
            this.serviceAvailableText = 'Service Available';
        } else {
            this.serviceAvailableText = 'Service Unavailable';
        }
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

    async submitAppointment() {
        if (!this.validateForm) {
            return;
        }
        this.submitting = true;
        this.cdRef.markForCheck();

        try {
            const appointment: Appointment = {
                UserId: this.userId,
                Serviceid: parseInt(this.selectedServiceID),
                Date: this.formattedDate,
                Details: this.serviceDescription,
                AppointmentId: 0,
                EmployeeId: this.randomEmployee.employeeId,
            };
            const createdAppointment = await this.appointmentService
                .addAppointment(appointment)
                .toPromise();

            if (createdAppointment) {
                const updateRequest: UpdateAvailabilityRequest = {
                    employeeId: createdAppointment.EmployeeId,
                    serviceId: parseInt(this.selectedServiceID),
                    date: this.formattedDate,
                    isAvailable: false,
                };

                await this.empAvailabilityService
                    .updateAvailability(updateRequest)
                    .toPromise();

                // 3. Show success message
                await Swal.fire({
                    title: 'Success!',
                    text: 'Your appointment has been scheduled successfully',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });

                // 4. Reset form
                this.resetForm();
            }
        } catch (error) {
            console.log('Error creating appointment: ', error);
            await Swal.fire({
                title: 'Error',
                text: 'Failed to schedule appointment. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            this.submitting = false;
            this.cdRef.markForCheck();
        }
    }

    private validateForm(): boolean {
        if (!this.selectedApptDate) {
            Swal.fire({
                title: 'Error',
                text: 'Please select an appointment date',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return false;
        }

        if (!this.selectedServiceID) {
            Swal.fire({
                title: 'Error',
                text: 'Please select a service',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return false;
        }

        if (!this.isAnyEmployeeAvailable) {
            Swal.fire({
                title: 'Error',
                text: 'No employees are available for this service on the selected date',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return false;
        }

        return true;
    }

    private resetForm() {
        this.selectedApptDate = '';
        this.selectedServiceID = '';
        this.serviceDescription = '';
        this.formattedDate = '';
        this.isServiceSelected = false;
        this.isAnyEmployeeAvailable = false;
        this.cdRef.markForCheck();
    }
}
