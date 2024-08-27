import { Component, Output, EventEmitter, Input, OnChanges, AfterViewInit, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface AppointmentData {
  title: string;
  type: string;
  start: Date;
  end: Date;
  guests: string;
  location: string;
  description: string;
  videoConference: boolean;
}

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnChanges, AfterViewInit {
  @Input() initialValues: { start: Date, end: Date } | null = null;
  @Input() clickPosition: { x: number, y: number } | null = null;
  @Output() appointmentAdded = new EventEmitter<AppointmentData>();
  @Output() closeForm = new EventEmitter<void>();
  @Output() highlightTimeRange = new EventEmitter<{ start: Date, end: Date }>();

  appointmentForm: FormGroup;

  constructor(private fb: FormBuilder, private el: ElementRef, private renderer: Renderer2) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      type: ['event', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      guests: [''],
      location: [''],
      description: [''],
      videoConference: [false]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValues'] && this.initialValues) {
      this.appointmentForm.patchValue({
        start: this.initialValues.start,
        end: this.initialValues.end
      });
    }
  }

  ngAfterViewInit() {
    if (this.clickPosition) {
      const formElement = this.el.nativeElement.querySelector('mat-card');
      if (!formElement) {
        console.error('mat-card element not found');
        return;
      }
      const formWidth = formElement.offsetWidth;
      const formHeight = formElement.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let left = this.clickPosition.x;
      let top = this.clickPosition.y;

      if (left + formWidth > windowWidth) {
        left = windowWidth - formWidth - 20; 
      }

      if (top + formHeight > windowHeight) {
        top = windowHeight - formHeight - 20;
      }

      this.renderer.setStyle(formElement, 'position', 'absolute');
      this.renderer.setStyle(formElement, 'left', `${left}px`);
      this.renderer.setStyle(formElement, 'top', `${top}px`);
    }
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const appointment: AppointmentData = {
        ...this.appointmentForm.value,
        start: new Date(this.appointmentForm.value.start),
        end: new Date(this.appointmentForm.value.end)
      };
      this.appointmentAdded.emit(appointment);
      this.highlightTimeRange.emit({
        start: appointment.start,
        end: appointment.end
      });
      this.closeForm.emit();
    }
  }
  

  formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric',
    });
  }
}