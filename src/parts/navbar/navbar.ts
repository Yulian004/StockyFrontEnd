import {Component, Input, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  @Input() role: string | null = null;
  user = {
    avatarUrl: '' // URL reale dell'immagine dell'utente
  };

  ngOnInit() {
    // Recuperiamo il role direttamente
    if (!this.role || this.role.trim() === '') {
      this.role = localStorage.getItem('role') || 'User';
    }
  }
  defaultAvatar = 'https://static.vecteezy.com/ti/vetor-gratis/p3/23016923-gato-simbolo-ilustracao-gratis-vetor.jpg';

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  onImageError(event: any) {
    event.target.src = this.defaultAvatar;
  }
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    this.router.navigate(['/login']);
  }
}
