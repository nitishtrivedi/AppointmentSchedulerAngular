import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Appointment } from '../../models/AppointmentModel';
import { AppointmentService } from '../../services/appointment.service';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-appointment-list',
  imports: [MatTableModule, MatPaginatorModule, MatButton],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
})
export class AppointmentListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: number[] = [];
  appointment: Appointment | undefined;
  apptArray: Appointment[] = [];
  dataSource = new MatTableDataSource<Appointment>();
  displayedColumns: string[] = ['id', 'details', 'category', 'date', 'actions'];

  constructor(private appointmentService: AppointmentService) {
    this.dataSource = new MatTableDataSource<Appointment>();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.dataArray.forEach((id) => {
      this.getAppointment(id);
    });
  }

  async getAppointment(apptId: number) {
    (await this.appointmentService.getAppointmentById(apptId)).subscribe(
      (appt) => {
        this.appointment = appt;
        this.apptArray.push(this.appointment);
        this.dataSource.data = this.apptArray;
      }
    );
  }

  viewAppointment(id: number) {
    console.log(id);
  }
}
