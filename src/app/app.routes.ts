import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register'
import {Homepage} from './componentsUser/pages/homepage/homepage';

import { Notifiche } from './componentsUser/pages/notifiche/notifiche';
import {Inventario} from './componentsUser/pages/inventario/inventario';
import {Storico} from './componentsUser/pages/storico/storico';
import {Messaggi} from './componentsUser/pages/messaggi/messaggi';
import {Gestione} from './componentsUser/pages/gestione/gestione';




function HomePageComponent() {

}

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: Homepage },
  { path: 'notifiche', component: Notifiche },
  { path: 'inventario', component: Inventario },
  { path: 'storico', component: Storico },
  { path: 'messaggi', component: Messaggi },
  { path: 'gestione', component: Gestione }

  // altre rotte...
];


