import { Appointment } from './AppointmentModel';

export interface User {
  userId: number;
  userName: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPassword: string;
  userPhone: string;
  userAddress: string;
  isUserAdmin: boolean;
  appointments: Appointment[];
}
