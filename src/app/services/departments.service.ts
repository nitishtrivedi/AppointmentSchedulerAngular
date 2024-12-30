import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../models/ServiceModel';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  private apiURL = 'https://localhost:5000/api/services';

  constructor(private http: HttpClient) {}

  async getServices(): Promise<Observable<Service[]>> {
    return this.http.get<Service[]>(this.apiURL);
  }
}
