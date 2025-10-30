import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarComponent } from '../parts/navbar/navbar';
import {FormsModule} from '@angular/forms';

interface Product {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [NavbarComponent, FormsModule],
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  role: string | null = null;
  products: Product[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('userRole');
    if (!this.role) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>('http://localhost:3000/api/products')
      .subscribe({
        next: (data) => { this.products = data; },
        error: (err) => { console.error('Errore nel caricamento prodotti', err); }
      });
  }

  updateProduct(product: Product) {
    const role = this.role;

    // Controllo permessi lato frontend (per sicurezza)
    if (role === 'User') {
      // L’utente può modificare solo la quantità
      this.http.put(`http://localhost:3000/api/products/${product._id}/quantity`, { quantity: product.quantity })
        .subscribe({
          next: () => alert('Quantità aggiornata!'),
          error: () => alert('Errore aggiornamento quantità')
        });
    } else {
      // Admin e Supervisore possono modificare tutto
      this.http.put(`http://localhost:3000/api/products/${product._id}`, product)
        .subscribe({
          next: () => alert('Prodotto aggiornato!'),
          error: () => alert('Errore aggiornamento prodotto')
        });
    }
  }
}
