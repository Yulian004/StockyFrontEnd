import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../parts/navbar/navbar';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [
    NavbarComponent
  ],
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  role: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('userRole');

    if (!this.role) {
      this.router.navigate(['/login']); // No Log? Torna al tuo paese
    }
  }

  logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
