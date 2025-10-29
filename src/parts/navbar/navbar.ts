import {Component, Input, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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

  ngOnInit() {
    // Recuperiamo il role direttamente
    if (!this.role || this.role.trim() === '') {
      this.role = localStorage.getItem('role') || 'User';
    }
  }
}
