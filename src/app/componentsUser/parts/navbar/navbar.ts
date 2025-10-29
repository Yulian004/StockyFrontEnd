import  { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  user = {
    avatarUrl: '' // URL reale dell'immagine dell'utente
  };

  defaultAvatar = 'https://static.vecteezy.com/ti/vetor-gratis/p3/23016923-gato-simbolo-ilustracao-gratis-vetor.jpg';

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    console.log('Utente disconnesso');
    // qui inserisci la logica reale di logout
  }

  onImageError(event: any) {
    event.target.src = this.defaultAvatar;
  }

}
