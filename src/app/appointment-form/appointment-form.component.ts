import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule],
  template: `
    <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput placeholder="Name" formControlName="title">
      </mat-form-field>
      <mat-form-field>
        <input matInput [matDatepicker]="picker" placeholder="Date" formControlName="date">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="!appointmentForm.valid">Добавить</button>
    </form>
  `,
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  @Output() appointmentAdded = new EventEmitter<any>();
  appointmentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.appointmentAdded.emit(this.appointmentForm.value);
      this.appointmentForm.reset();
    }
  }
}