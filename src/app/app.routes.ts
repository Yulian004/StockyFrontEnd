import { Routes } from '@angular/router';
import { LoginComponent } from '../login/LoginTs';
import { HomepageComponent } from '../homepage/HomepageTS';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomepageComponent }
];
