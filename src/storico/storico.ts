import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from '../parts/navbar/navbar';

@Component({
  selector: 'app-storico',
  imports: [
    NavbarComponent
  ],
  templateUrl: './storico.html',
  styleUrl: './storico.scss'
})
export class Storico implements OnInit{
  role: string = '';

  ngOnInit(): void {
    // Recupera il ruolo
    this.role = localStorage.getItem('userRole') || 'User';
  }

}
