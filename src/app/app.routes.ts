import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register'
import { Notifiche } from './componentsUser/pages/notifiche/notifiche';
import {Inventario} from './componentsUser/pages/inventario/inventario';
import {Storico} from './componentsUser/pages/storico/storico';
import {Messaggi} from './componentsUser/pages/messaggi/messaggi';
import {GestioneComponent} from './componentsUser/pages/gestione/gestione';
import {Homepage} from './componentsUser/pages/HomePage/HomepageTS';



function HomePageComponent() {

}

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'Homepage', component: Homepage },
  { path: 'notifiche', component: Notifiche },
  { path: 'inventario', component: Inventario },
  { path: 'storico', component: Storico },
  { path: 'messaggi', component: Messaggi },
  { path: 'gestione', component: GestioneComponent }

  // altre rotte...
];


