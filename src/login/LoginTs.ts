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
        next: () => {

          this.http.get("api/userinformation").subscribe(
            {
              next: (response: any)=>
              {
                const role = response.role;
                let user = response;
                // Salva ruolo e token
                localStorage.setItem('userRole', role);

                // localStorage.setItem('token', token); // **

                alert('Login effettuato con successo ✅');
                this.router.navigate(['/dashboard']);

                this.loading = false;
              },
              error: (err) => {
                this.errorMessage = 'Accesso scaduto.';
                this.loading = false;
              }
            }

          )
          // Controlla il ruolo restituito dal backend

        },
        error: (err) => {
          this.errorMessage = 'Credenziali non valide.';
          this.loading = false;
        }
      });
  }
}
