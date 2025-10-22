import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, UserData } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8), // Lunghezza minima 8 caratteri
        Validators.pattern(
          // Almeno una maiuscola, una minuscola, un numero, un carattere speciale
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&.,;]{8,}$'
        )
      ]),
    ruolo: new FormControl('user', Validators.required)
  });

  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;


  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.valid) {
      const v = this.registerForm.value;
      const userData: UserData = {
        nome: v.nome!,
        cognome: v.cognome!,
        email: v.email!,
        password: v.password!,
        ruolo: v.ruolo!
      };
      console.log('Invio dati al servizio:', userData);

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Risposta dal servizio mock:', response);
          this.successMessage = response.message;


        },
        error: (error) => {
          this.isLoading = false;
          console.error('Errore dal servizio:', error);
          this.errorMessage = error.message || 'Errore durante la registrazione. Riprova.';
        }
      });

    } else {
      this.isLoading = false;
      console.error('Form non valido');
      this.errorMessage = 'Per favore, compila correttamente tutti i campi.';
    }
  }
}
