import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router} from '@angular/router';
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
  
  constructor(private router:Router) {}

  navigateToHome() {
    this.router.navigate(['/home']).then(() => {
      window.location.reload(); // Refresh the page after navigation
    });
  }
}

