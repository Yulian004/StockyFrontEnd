import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register' // Importa il componente

export const routes: Routes = [
  // Altre rotte...
  { path: 'register', component: RegisterComponent } // Aggiungi questa rotta
];