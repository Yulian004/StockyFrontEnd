import { Routes } from '@angular/router';
import { LoginComponent } from '../login/LoginTs';
import { HomepageComponent } from '../homepage/HomepageTS';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomepageComponent }

  // TODO
  /*
   {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [AuthGuard],
    data: { role: 'Admin' } // 👈 Solo Admin
  },
   {
    path: 'superuser',
    component: SuperUserPageComponent,
    canActivate: [AuthGuard],
    data: { role: 'SuperUser' } // 👈 Solo SuperUser
  },
  {
    path: 'user',
    component: UserPageComponent,
    canActivate: [AuthGuard],
    data: { role: 'User' } // 👈 Solo User
  },
  Errore 404 reindirizza a home
  { path: '**', redirectTo: 'home' }
   */
];
