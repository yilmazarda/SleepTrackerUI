import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddSleepComponent } from './add-sleep/add-sleep.component';

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "add",
    component: AddSleepComponent
  }
];
