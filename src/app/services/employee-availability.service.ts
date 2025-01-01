import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AvailabilityRequest } from '../models/AvailabilityRequestModel';
import { AvailabilityResponse } from '../models/AvailabilityResponseModel';
import { Observable } from 'rxjs';

export interface UpdateAvailabilityRequest {
    employeeId: number;
    serviceId: number;
    date: string;
    isAvailable: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class EmployeeAvailabilityService {
    private apiURL = 'https://localhost:5000/api/EmployeeAvailability';

    constructor(private http: HttpClient) {}

    async checkAvailability(
        request: AvailabilityRequest
    ): Promise<Observable<AvailabilityResponse>> {
        return this.http.post<AvailabilityResponse>(
            `${this.apiURL}/check`,
            request
        );
    }

    updateAvailability(request: UpdateAvailabilityRequest): Observable<any> {
        return this.http.post(`${this.apiURL}/update`, request);
    }
}
