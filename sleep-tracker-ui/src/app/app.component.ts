import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    RouterModule,
    MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sleep-tracker-ui';
}
