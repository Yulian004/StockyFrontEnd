import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarComponent } from '../parts/navbar/navbar';
import { FormsModule } from '@angular/forms';

interface Product {
  _id?: string;
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
  showAddForm = false;

  newProduct: Product = {
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    status: 'Disponibile'
  };

  private readonly API = 'api/products';

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
    this.http.get<Product[]>('/api/products').subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Errore nel caricamento prodotti', err)
    });
  }

  // SUPERVISORE - Aggiunta
  addProduct() {
    this.http.post<Product>(`/api/superuser/create`, this.newProduct).subscribe({
      next: (res) => {
        alert('Prodotto aggiunto con successo');
        this.products.push(res);
        this.showAddForm = false;
        this.newProduct = { name: '', category: '', quantity: 0, price: 0, status: 'Disponibile' };
      },
      error: (err) => alert('Errore aggiunta prodotto: ' + err.message)
    });
  }

  // SUPERVISORE - Modifica
  updateProduct(product: Product) {
    this.http.post(`/api/superuser/update`, product).subscribe({
      next: () => alert('Prodotto modificato con successo'),
      error: () => alert('Errore modifica prodotto')
    });
  }

  // SUPERVISORE - Cancellazione
  deleteProduct(id?: string) {
    if (!id) return;
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;

    this.http.post(`/api/superuser/delete`, { id }).subscribe({
      next: () => {
        alert('Prodotto eliminato');
        this.products = this.products.filter(p => p._id !== id);
      },
      error: () => alert('Errore eliminazione prodotto')
    });
  }

  // USER - Operazioni quantità
  addQuantity(product: Product) {
    const payload = {
      id: product._id,
      quantity: product.quantity,
      keyword: 'acquisto'
    };

    this.http.post(`/api/add`, payload).subscribe({
      next: () => alert('Quantità aggiunta con successo (Acquisto registrato)'),
      error: () => alert('Errore durante aggiunta quantità')
    });
  }

  subQuantity(product: Product) {
    const payload = {
      id: product._id,
      quantity: product.quantity,
      keyword: 'vendita'
    };

    this.http.post(`/api/sub`, payload).subscribe({
      next: () => alert('Quantità ridotta con successo (Vendita registrata)'),
      error: () => alert('Errore durante riduzione quantità')
    });
  }

  adjustQuantity(product: Product) {
    this.http.post(`/api/adjustment`, { id: product._id, quantity: product.quantity }).subscribe({
      next: () => alert('Quantità modificata con successo'),
      error: () => alert('Errore modifica quantità')
    });
  }
}
