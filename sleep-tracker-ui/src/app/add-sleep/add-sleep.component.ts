import { Component } from '@angular/core';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import { MaterialModule } from '../material/material.module';
import { AbstractControl, AbstractControlOptions, AsyncValidator, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-sleep',
  standalone: true,
  imports: [NgxMatTimepickerModule,
  MaterialModule,
  ReactiveFormsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  CommonModule],
  templateUrl: './add-sleep.component.html',
  styleUrl: './add-sleep.component.scss'
})
export class AddSleepComponent {
  public apiUrl = "http://localhost:5010/api";
  sleepForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.InitiateForm();
  }

  InitiateForm() {
    this.sleepForm = this.fb.group({
      sleepStartDate: ['', Validators.required],
      sleepStartTime: ['', Validators.required],
      sleepEndDate: ['', Validators.required],
      sleepEndTime: ['', Validators.required]
    }, {validators: this.timeValidation.bind(this)});

    this.sleepForm.valueChanges.subscribe(() => {
      this.sleepForm.updateValueAndValidity({ emitEvent: false });
    });
  }

  timeValidation(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get("sleepStartDate")?.value;
    const endDate = control.get("sleepEndDate")?.value;
    const startTime = control.get("sleepStartTime")?.value;
    const endTime = control.get("sleepEndTime")?.value;

  
    // Skip validation if any value is missing
    if (!startDate || !endDate || !startTime || !endTime) {
      return null;
    }

    // Compare date values ignoring time part
    const startDateOnly = new Date(startDate).setHours(0, 0, 0, 0);
    const endDateOnly = new Date(endDate).setHours(0, 0, 0, 0);
  
    // Check if end date is earlier than start date
    if (endDateOnly < startDateOnly) {
      return { endDateEarlierThanStartDate: true };
    }
  
    // If dates are the same, check if start time is earlier than end time
    if (startDateOnly === endDateOnly) {
      const startTimeInMinutes = this.parseTimeToMinutes(startTime);
      const endTimeInMinutes = this.parseTimeToMinutes(endTime);

      if (startTimeInMinutes > endTimeInMinutes) {
        return { endTimeEarlierThanStartTime: true };
      }
    }
  
    return null; // Valid case
  }

  onSubmit() {
    if(this.sleepForm.valid) {
      const sleepStartTime = this.sleepForm.value.sleepStartTime;
      const sleepStartDate = this.sleepForm.value.sleepStartDate;
      const sleepEndTime = this.sleepForm.value.sleepEndTime;
      const sleepEndDate = this.sleepForm.value.sleepEndDate;

    // Parse hours and minutes from the time strings (assuming format is 'HH:mm')
    const [startHours, startMinutes] = sleepStartTime.split(':').map(Number);
    const [endHours, endMinutes] = sleepEndTime.split(':').map(Number);

    // Combine date and time into single Date objects
    const sleepStartDateTime = new Date(sleepStartDate);
    sleepStartDateTime.setHours(startHours, startMinutes, 0, 0);

    const sleepEndDateTime = new Date(sleepEndDate);
    sleepEndDateTime.setHours(endHours, endMinutes, 0, 0);

    // Check the values (optional)
    console.log('Start DateTime:', sleepStartDateTime);
    console.log('End DateTime:', sleepEndDateTime);

    const payload = {
      sleepStart: sleepStartDateTime.toISOString(), // Example: "2024-11-12T14:30:00.000Z"
      sleepEnd: sleepEndDateTime.toISOString(),
    };

    this.postSleep(payload);
    
    }
  }

  postSleep(sleepObject : object) {
    this.http.post(`${this.apiUrl}/Sleep`, sleepObject).subscribe(
      (response) => {
        console.log('API Response:', response);
        this.errorMessage = null;
      },
      (error) => {
        console.log('Error posting sleep record:', error);
        this.errorMessage = 'Failed to save sleep record.'
      }
    )
    this.navigateToHome();
  }

  parseTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  navigateToHome() {
    this.router.navigate(['/home']).then(() => {
      window.location.reload(); // Refresh the page after navigation
    });
  }
}


