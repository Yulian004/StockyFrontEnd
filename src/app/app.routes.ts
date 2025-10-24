import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register'
import {Homepage} from './components/pages/homepage/homepage';

import { Notifiche } from './components/pages/notifiche/notifiche';
import {Inventario} from './components/pages/inventario/inventario';
import {Storico} from './components/pages/storico/storico';
import {Messaggi} from './components/pages/messaggi/messaggi';


function HomePageComponent() {

}

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: Homepage },
  { path: 'notifiche', component: Notifiche },
  { path: 'inventario', component: Inventario },
  { path: 'storico', component: Storico },
  { path: 'messaggi', component: Messaggi }

  // altre rotte...
];


