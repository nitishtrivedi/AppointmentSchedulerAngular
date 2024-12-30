import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/AppointmentModel';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiURL = 'https://localhost:5000/api/appointments';
  constructor(private http: HttpClient) {}

  async getAppointmentById(id: number): Promise<Observable<Appointment>> {
    return await this.http.get<Appointment>(`${this.apiURL}/${id}`);
  }

  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiURL}`, appointment);
  }
}
