import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppointmentData } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments = new BehaviorSubject<any[]>([]);
  private nextId = 1;

  getAppointments() {
    return this.appointments.asObservable();
  }

  addAppointment(appointment: AppointmentData) {
    const newAppointment = {
      ...appointment,
      id: this.nextId++,
    };
    const currentAppointments = this.appointments.value;
    this.appointments.next([...currentAppointments, newAppointment]);
  }

  getAppointmentsForDate(date: Date) {
    return this.appointments.value.filter(appointment => 
      appointment.start && new Date(appointment.start).toDateString() === date.toDateString()
    );
  }
  

  updateAppointment(updatedAppointment: AppointmentData) {
    const currentAppointments = this.appointments.value;
    const index = currentAppointments.findIndex(a => a.id === updatedAppointment.id);
    if (index > -1) {
      currentAppointments[index] = updatedAppointment;
      this.appointments.next(currentAppointments);
    }
  }

  deleteAppointment(appointment: AppointmentData) {
    const currentAppointments = this.appointments.value;
    const updatedAppointments = currentAppointments.filter(a => a.id !== appointment.id);
    this.appointments.next(updatedAppointments);
  }
}