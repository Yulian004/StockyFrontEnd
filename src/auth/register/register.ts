import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NavbarComponent } from '../../parts/navbar/navbar';

interface UserPayload {
  nome: string;
  cognome: string;
  email: string;
  password?: string;
  ruolo: string; // 'User' | 'Supervisore' | 'Admin'
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  role: string = '';
  isRegistering = false;
  isSavingEdit = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Register form
  registerForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&.,;]{8,}$')
    ]),
    ruolo: new FormControl('', Validators.required)
  });

  // Edit form
  editForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''), // opzionale
    ruolo: new FormControl('User', Validators.required)
  });

  // ricerca/modifica
  searchEmail: string = '';
  editingUser: any = null; // conterrà l'utente caricato { _id, nome, cognome, email, ruolo, roles }

  private API = 'api/admin';

  constructor(private http: HttpClient) {
    this.role = localStorage.getItem('userRole') || '';
  }

  onRegister() {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      this.errorMessage = 'Compila correttamente tutti i campi.';
      return;
    }

    this.isRegistering = true;
    const v = this.registerForm.value;
    const payload: UserPayload = {
      nome: v.nome!,
      cognome: v.cognome!,
      email: v.email!,
      password: v.password!,
      ruolo: v.ruolo!
    };

    this.http.post<{ message: string }>('/api/create', payload).subscribe({
      next: (res) => {
        this.isRegistering = false;
        this.successMessage = res.message || 'Utente registrato con successo';
        this.registerForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.isRegistering = false;
        this.errorMessage = err.error?.message || 'Errore durante la registrazione';
      }
    });
  }

  // Cerca utente per email e popola editForm
  findUserByEmail() {
    this.successMessage = null;
    this.errorMessage = null;
    if (!this.searchEmail) return;

    this.http.get<any>(`${this.API}?email=${encodeURIComponent(this.searchEmail)}`).subscribe({
      next: (u) => {
        if (!u) {
          this.errorMessage = 'Utente non trovato';
          this.editingUser = null;
          return;
        }
        this.editingUser = u;
        // Popola form (password vuota: cambia solo se inserita)
        this.editForm.setValue({
          nome: u.nome || '',
          cognome: u.cognome || '',
          email: u.email || '',
          password: '',
          ruolo: (u.roles && u.roles.includes('Admin')) ? 'Admin' : (u.roles && u.roles.includes('Supervisore') ? 'Supervisore' : 'User')
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Errore nella ricerca utente';
        this.editingUser = null;
      }
    });
  }

  onEditSave() {
    if (!this.editingUser) {
      this.errorMessage = 'Nessun utente da modificare';
      return;
    }
    if (this.editForm.invalid) {
      this.errorMessage = 'Compila correttamente tutti i campi per la modifica';
      return;
    }

    this.isSavingEdit = true;
    this.successMessage = null;
    this.errorMessage = null;

    const v = this.editForm.value;
    // Prepariamo payload per aggiornamento; se password vuota -> non la inviamo
    const updatePayload: any = {
      nome: v.nome!,
      cognome: v.cognome!,
      email: v.email!,
      ruolo: v.ruolo!
    };
    if (v.password && v.password.trim().length > 0) {
      updatePayload.password = v.password;
    }

    // endpoint PUT da /api/users/:id
    const id = this.editingUser._id;
    this.http.put<{ message?: string }>(`api/modify`, updatePayload).subscribe({
      next: (res) => {
        this.isSavingEdit = false;
        this.successMessage = res.message || 'Utente aggiornato con successo';
        // aggiorna local copy
        this.editingUser = { ...this.editingUser, ...updatePayload };
        // svuota password
        this.editForm.get('password')?.setValue('');
      },
      error: (err) => {
        this.isSavingEdit = false;
        this.errorMessage = err.error?.message || 'Errore durante l\'aggiornamento';
      }
    });
  }

  cancelEdit() {
    this.editingUser = null;
    this.editForm.reset();
    this.searchEmail = '';
  }
}
