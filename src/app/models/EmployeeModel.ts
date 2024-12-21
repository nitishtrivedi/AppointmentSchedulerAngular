import { Appointment } from './AppointmentModel';

export interface Employee {
    employeeId: number;
    employeeName: string;
    employeeService: string;
    isAvailable: boolean;
    appointments: Appointment[];
}
