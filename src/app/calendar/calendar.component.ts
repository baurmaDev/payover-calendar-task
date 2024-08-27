import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentData } from '../models/appointment.model'; 

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    AppointmentFormComponent,
    CdkDrag,
    CdkDropList,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  appointments: any[] = [];
  currentDate: Date = new Date(2024, 7, 27);
  days: string[] = ['S', 'M', 'Т', 'W', 'T', 'F', 'S'];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  weekDates: Date[] = [];
  selectedTimeRange: { start: Date, end: Date } | null = null;
  selectedSlot: { date: Date, hour: number } | null = null;
  clickPosition: { x: number, y: number } | null = null;
  selectedAppointment: AppointmentData | null = null;
  draggedAppointment: AppointmentData | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.updateWeekDates();
    this.loadAppointments();
  }
  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.appointments = appointments;
    });
  }
  onAppointmentClick(appointment: any) {
    this.selectedAppointment = appointment;
    console.log(this.selectedAppointment);
  }
  onDeleteAppointment(appointment: AppointmentData) {
    this.appointmentService.deleteAppointment(appointment);
    this.loadAppointments(); 
  }
  onUpdateAppointment(appointment: AppointmentData) {
    this.appointmentService.updateAppointment(appointment);
    this.loadAppointments(); 
    this.onFormClose();
  }
  isAppointmentInHour(appointment: any, hour: number): boolean {
    return appointment.start.getHours() === hour;
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

  onDragStarted(appointment: AppointmentData) {
    this.draggedAppointment = appointment;
    console.log("Drag started: ", this.draggedAppointment);
  }

  onDragEnded(event: any) {
    console.log("Drag ended: ", this.draggedAppointment);

    this.draggedAppointment = null;
  }

  onDrop(event: CdkDragDrop<any>, date: Date) {
    console.log("Drag drop: ", this.draggedAppointment);

    if (!this.draggedAppointment) {
      return;
    }

    const newStart = new Date(date);
    newStart.setHours(event.container.data, 0, 0, 0);
    const duration = this.draggedAppointment.end.getTime() - this.draggedAppointment.start.getTime();
    const newEnd = new Date(newStart.getTime() + duration);

    const updatedAppointment: AppointmentData = {
      ...this.draggedAppointment,
      start: newStart,
      end: newEnd
    };

    this.appointmentService.updateAppointment(updatedAppointment);
    this.loadAppointments(); 
    this.draggedAppointment = null;
  }

  onAppointmentAdded(appointment: any) {
    this.appointmentService.addAppointment(appointment);
    console.log(this.appointmentService.getAppointments());
    this.selectedTimeRange = null;
    this.selectedSlot = null;
    this.loadAppointments();
    this.onFormClose();
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
  onFormClose() {
    this.selectedTimeRange = null;
    this.selectedAppointment = null;
  }
}