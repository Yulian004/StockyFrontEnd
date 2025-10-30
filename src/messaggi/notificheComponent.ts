import { Component } from '@angular/core';
import {NavbarComponent} from '../parts/navbar/navbar';


@Component({
  selector: 'app-notifications-page',
  templateUrl: './notificheComponent.html',
  imports: [
    NavbarComponent
  ],
  styleUrls: ['./notificheComponent.css']
})



export class NotificheComponent{
  role: string = '';

  ngOnInit(): void {
    this.role = localStorage.getItem('userRole') || 'User'; // Recupera il ruolo salvato
  }
}
