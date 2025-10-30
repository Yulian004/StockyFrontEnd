import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../parts/navbar/navbar';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Operation {
  _id: string;
  user: string;
  action: string;
  product: string;
  quantity: number;
  timestamp: string;
  status: string;
}

@Component({
  selector: 'app-storico',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './storico.html',
  styleUrls: ['./storico.scss']
})
export class Storico implements OnInit {
  role: string = '';
  operations: Operation[] = [];
  filteredOperations: Operation[] = [];

  users: string[] = [];
  timeFilters = ['Tutti', 'Ultimi 7 giorni', 'Ultimo mese', 'Ultimo trimestre'];

  selectedUser: string = 'Tutti';
  selectedTime: string = 'Tutti';

  private readonly API = 'api/storico';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('userRole') || 'User';

    // Solo Admin e Supervisore possono accedere
    if (this.role === 'Admin' || this.role === 'Supervisore') {
      this.loadOperations();
    }
  }

  loadOperations() {
    this.http.get<Operation[]>(this.API).subscribe({
      next: (data) => {
        this.operations = data;
        this.filteredOperations = data;

        // Estrai lista univoca utenti
        this.users = ['Tutti', ...new Set(data.map(op => op.user))];
      },
      error: (err) => console.error('Errore caricamento storico:', err)
    });
  }

  applyFilters() {
    let result = [...this.operations];

    // 🔹 Filtro utente
    if (this.selectedUser !== 'Tutti') {
      result = result.filter(op => op.user === this.selectedUser);
    }

    // 🔹 Filtro tempo
    const now = new Date();
    if (this.selectedTime === 'Ultimi 7 giorni') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      result = result.filter(op => new Date(op.timestamp) >= weekAgo);
    } else if (this.selectedTime === 'Ultimo mese') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      result = result.filter(op => new Date(op.timestamp) >= monthAgo);
    } else if (this.selectedTime === 'Ultimo trimestre') {
      const quarterAgo = new Date(now.setMonth(now.getMonth() - 3));
      result = result.filter(op => new Date(op.timestamp) >= quarterAgo);
    }

    this.filteredOperations = result;
  }
}
