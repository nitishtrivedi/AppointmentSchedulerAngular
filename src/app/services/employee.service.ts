import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/EmployeeModel';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiURL = 'https://localhost:5000/api/employees';

  constructor(private http: HttpClient) {}

  async getEmployees(): Promise<Observable<Employee[]>> {
    return this.http.get<Employee[]>(this.apiURL);
  }
}
