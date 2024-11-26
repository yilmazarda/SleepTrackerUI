import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recording',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './recording.component.html',
  styleUrl: './recording.component.scss'
})
export class RecordingComponent {
  public apiUrl = "http://localhost:5010/api"; // Update this with your actual API URL

  sleepForm!: FormGroup;
  timer: any;
  startTime: number | null = null;
  endTime: number | null = null;
  elapsedTime: string = '00:00:00'; // Timer display

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
    this.InitiateForm();
  }

  InitiateForm() {
    this.sleepForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }

  // Start the timer
  startRecording() {
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      const elapsed = Date.now() - this.startTime!;
      this.elapsedTime = this.formatTime(elapsed);
    }, 1000);

    // Enable stop button
    (document.getElementById('stopBtn') as HTMLButtonElement).disabled = false;
    (document.getElementById('startBtn') as HTMLButtonElement).disabled = true;
  }

  // Stop the timer
  stopRecording() {
    this.endTime = Date.now();
    clearInterval(this.timer);
    (document.getElementById('startBtn') as HTMLButtonElement).disabled = false;
    (document.getElementById('stopBtn') as HTMLButtonElement).disabled = true;

    // Save the sleep record
    const sleepRecord = {
      sleepStart: new Date(this.startTime!).toISOString(),
      sleepEnd: new Date(this.endTime!).toISOString()
    };

    // Send to the server
    this.http.post(`${this.apiUrl}/sleep`, sleepRecord).subscribe(
      (response) => {
        this.snackBar.open('Sleep record saved successfully', 'Close', { duration: 3000 });
      },
      (error) => {
        this.snackBar.open('Error saving sleep record', 'Close', { duration: 3000 });
      }
    );
  }

  // Format the elapsed time as HH:mm:ss
  formatTime(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  // Pad time with leading zero
  padTime(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
