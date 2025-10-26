import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [
    FormsModule,
  ],
  styleUrls: ['./loginCSS.css']
})
export class LoginComponent {
  user: string = '';
  password: string = '';
  loading: boolean = false; // La roba del bottone, da ignorare per backend
  errorMessage: string = ''; // Serve il popup errore

  constructor(private http: HttpClient, private router: Router) {} // Chiamata all'Injection


  onLogin() {
    this.errorMessage = '';
    this.loading = true; // Sta roba resfresha il messaggio d'errore così non compare ogni volta

    if (!this.user || !this.password) {
      this.errorMessage = 'Compila tutti i campi.';
      this.loading = false;
      return;
    }

    const loginData = {
      user: this.user,
      password: this.password
    };

    // Roba Backend
    this.http.post('api/login', loginData)
      .subscribe({
        next: (response: any) => {
          // Controlla il ruolo restituito dal backend
          const role = response.role;
          const token = response.token; // **

          // Salva ruolo e token
          localStorage.setItem('userRole', role);
          localStorage.setItem('token', token); // **


          // Naviga alla pagina corretta in base al ruolo (Me serve er nome del ruolo)
          switch (role) {
            case 'Admin':
              alert('Login effettuato con successo ✅');
              this.router.navigate(['/AdminDeiPiedi']);
              break;
            case 'SuperUser':
              alert('Login effettuato con successo ✅');
              this.router.navigate(['/PaginaDelSuperUser']);
              break;
            case 'User':
              alert('Login effettuato con successo ✅');
              this.router.navigate(['/PaginaDelloUser']);
              break;
            default:
              this.errorMessage = 'Utente non riconosciuto.';
          }

          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Credenziali non valide.';
          this.loading = false;
        }
      });
  }
}

/*
DA METTERE PUOI DENTRO LA PAGINE PROTETTE!!!
logout() {
  localStorage.removeItem('userRole');
  localStorage.removeItem('token');
  this.router.navigate(['/']);
}
 */
