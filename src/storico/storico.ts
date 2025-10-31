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
  selectedUser: string = 'Tutti';
  startDate: string = '';
  endDate: string = '';

  private readonly API = 'api/superuser';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('userRole') || 'User';
    if (this.role === 'Admin' || this.role === 'Supervisore') {
      this.loadOperations();
    }
  }

  // 🔹 Carica tutto lo storico all'avvio
  loadOperations() {
    this.http.get<Operation[]>('${this.API}/alloperation').subscribe({
      next: (data) => {
        this.operations = data;
        this.filteredOperations = data;
        this.users = ['Tutti', ...new Set(data.map(op => op.user))];
      },
      error: (err) => console.error('Errore caricamento storico:', err)
    });
  }

  // 🔹 Filtro basato su range di date e utente
  applyFilters() {
    if (!this.startDate || !this.endDate) {
      alert('Seleziona sia la data di inizio che quella di fine.');
      return;
    }

    const params: any = {
     day: this.startDate,
      from: '00:00:00',
      to: '23:59:59'
    };
    if (this.selectedUser !== 'Tutti') {
      params.user = this.selectedUser;
    }

    this.http.get<Operation[]>(`${this.API}/operationtime`, { params }).subscribe({
      next: (data) => {
        this.filteredOperations = data;
      },
      error: (err) => {
        console.error('Errore nel filtro temporale:', err);
        alert('Errore durante il filtraggio per data.');
      }
    });
  }
}
