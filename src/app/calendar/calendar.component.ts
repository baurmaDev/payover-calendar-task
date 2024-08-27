import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule, DragDropModule, MatButtonModule, MatIconModule, AppointmentFormComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date(2024, 7, 27);
  days: string[] = ['S', 'M', 'Т', 'W', 'T', 'F', 'S'];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  weekDates: Date[] = [];
  selectedTimeRange: { start: Date, end: Date } | null = null;
  selectedSlot: { date: Date, hour: number } | null = null;
  clickPosition: { x: number, y: number } | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.updateWeekDates();
  }

  updateWeekDates() {
    this.weekDates = this.getWeekDates(this.currentDate);
  }
  getWeekDates(date: Date): Date[] {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(date);
      day.setDate(date.getDate() - date.getDay() + i);
      week.push(day);
    }
    return week;
  }

  isCurrentDay(date: Date): boolean {
    return date.toDateString() === this.currentDate.toDateString();
  }

  changeWeek(offset: number) {
    this.currentDate.setDate(this.currentDate.getDate() + offset);
    this.updateWeekDates();
  }
  getAppointmentsForDate(date: Date) {
    return this.appointmentService.getAppointmentsForDate(date);
  }

  onDragEnded(event: any, appointment: any) {
  }

  onAppointmentAdded(appointment: any) {
    this.appointmentService.addAppointment(appointment);
    this.selectedTimeRange = null;
    this.selectedSlot = null;
  }
  onTimeSlotClick(event: MouseEvent, date: Date, hour: number,) {
    const start = new Date(date);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + 1, 0, 0, 0);
    this.selectedTimeRange = { start, end };
    this.clickPosition = { x: event.clientX, y: event.clientY };
    this.selectedSlot = { date, hour };
    
  }
  isSelectedSlot(date: Date, hour: number): boolean {
    if (!this.selectedSlot) return false;
    return (
      this.selectedSlot.date.toDateString() === date.toDateString() &&
      this.selectedSlot.hour === hour
    );
  }
}