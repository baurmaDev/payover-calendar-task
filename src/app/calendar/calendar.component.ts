import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule, DragDropModule, AppointmentFormComponent],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Календарь</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="calendar-grid">
          <div *ngFor="let date of dates" class="calendar-day">
            {{ date | date:'shortDate' }}
            <div *ngFor="let appointment of getAppointmentsForDate(date)"
                 cdkDrag
                 (cdkDragEnded)="onDragEnded($event, appointment)">
              {{ appointment.title }}
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
    <app-appointment-form (appointmentAdded)="onAppointmentAdded($event)"></app-appointment-form>
  `,
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  dates: Date[] = [];
  
  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.generateDates();
  }

  generateDates() {
    // Генерация дат для календаря
  }

  getAppointmentsForDate(date: Date) {
    return this.appointmentService.getAppointmentsForDate(date);
  }

  onDragEnded(event: any, appointment: any) {
    // Обработка перемещения встречи
  }

  onAppointmentAdded(appointment: any) {
    this.appointmentService.addAppointment(appointment);
  }
}