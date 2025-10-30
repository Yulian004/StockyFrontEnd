import { Component } from '@angular/core';
import {NavbarComponent} from '../parts/navbar/navbar';


@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifiche.component.html',
  imports: [
    NavbarComponent
  ],
  styleUrls: ['./notifiche.component.css']
})



export class NotificheComponent{
  role: string = '';

  ngOnInit(): void {
    this.role = localStorage.getItem('userRole') || 'User'; // Recupera il ruolo salvato
  }
}
