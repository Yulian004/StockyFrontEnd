import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NavbarComponent } from '../../parts/navbar/navbar';

interface UserPayload {
  name: string;
  surname: string;
  email: string;
  password?: string;
  role: string; // 'User' | 'Supervisore' | 'Admin'
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

  // Lista utenti (solo Admin)
  usersList: any[] = [];
  isLoadingUsers = false;
  loadUsersError: string | null = null;

  // Register form
  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&.,;]{8,}$')
    ]),
    role: new FormControl('', Validators.required)
  });

  // Edit form
  editForm = new FormGroup({
    id : new FormControl<String | null>(null),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''), // opzionale
    role: new FormControl('STANDARD', Validators.required)
  });

  // ricerca/modifica
  searchEmail: string = '';
  editingUser: any = null; // conterrà l'utente caricato { id, nome, cognome, email, ruolo, roles }

  private API = '/api/admin/';

  constructor(private http: HttpClient) {
    this.role = localStorage.getItem('userRole') || '';

    // Se Admin, carica tutti gli utenti
    if (this.role === 'ADMIN') {
      this.loadAllUsers();
    }
  }

  // Registra
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
      name: v.name!,
      surname: v.surname!,
      email: v.email!,
      password: v.password!,
      role: v.role!
    };

    this.http.post('/api/admin/create', payload).subscribe({
      next: () => {
        this.isRegistering = false;
        this.successMessage = 'Utente registrato con successo';
        this.registerForm.reset();

        // aggiorna lista se admin
        if (this.role === 'ADMIN') this.loadAllUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.isRegistering = false;
        this.errorMessage = err.error?.message || 'Errore durante la registrazione';
      }
    });
  }

 // Modifica e ricerca
  findUserByEmail() {
    this.successMessage = null;
    this.errorMessage = null;
    if (!this.searchEmail) return;

    this.http.get<any>(`${this.API}find?email=${encodeURIComponent(this.searchEmail)}`).subscribe({
      next: (u) => {
        if (!u) {
          this.errorMessage = 'Utente non trovato';
          this.editingUser = null;
          return;
        }
        this.editingUser = u;
        // Butta nella form (password vuota: cambia solo se inserita)
        this.editForm.setValue({
          id : (u.id ?? u._id) || null,
          name: u.name || '',
          surname: u.surname || '',
          email: u.email || '',
          password: '',
          role: (u.roles && u.roles.includes('ADMIN'))
            ? 'ADMIN'
            : (u.roles && u.roles.includes('SUPERUSER'))
              ? 'SUPERUSER'
              : 'STANDARD'
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
      name: v.name!,
      surname: v.surname!,
      email: v.email!,
      role: v.role!
    };
    if (v.password && v.password.trim().length > 0) {
      updatePayload.password = v.password;
    }
      console.log(updatePayload)
    // endpoint PUT da /api/modify
    const id = this.editingUser.id ?? this.editingUser.id;
    const url = `${this.API}modify?id=${encodeURIComponent(id)}`;
    this.http.put(url , updatePayload).subscribe({
      next: (res) => {
        this.isSavingEdit = false;
        this.successMessage =  'Utente aggiornato con successo';
        // aggiorna local copy
        this.editingUser = { ...this.editingUser, ...updatePayload };
        this.editForm.get('password')?.setValue('');

        // aggiorna lista se admin
        if (this.role === 'ADMIN') this.loadAllUsers();
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


  // Lista admin utenti

  loadAllUsers() {
    this.isLoadingUsers = true;
    this.loadUsersError = null;

    this.http.get<any[]>('/api/admin/userlist').subscribe({
      next: (users) => {
        this.isLoadingUsers = false;
        this.usersList = users;
      },
      error: (err) => {
        this.isLoadingUsers = false;
        this.loadUsersError = err.error?.message || 'Errore nel caricamento utenti';
      }
    });
  }
}
