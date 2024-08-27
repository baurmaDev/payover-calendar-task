import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments = new BehaviorSubject<any[]>([]);

  getAppointments() {
    return this.appointments.asObservable();
  }

  addAppointment(appointment: any) {
    const currentAppointments = this.appointments.value;
    this.appointments.next([...currentAppointments, appointment]);
  }

  getAppointmentsForDate(date: Date) {
    return this.appointments.value.filter(appointment => 
      appointment.start && new Date(appointment.start).toDateString() === date.toDateString()
    );
  }
  

  deleteAppointment(appointment: any) {
    const currentAppointments = this.appointments.value;
    this.appointments.next(currentAppointments.filter(a => a !== appointment));
  }
}