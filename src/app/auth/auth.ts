import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface UserData {
  nome: string ;
  cognome: string;
  email: string ;
  password: string ;
  ruolo: string ;
}

@Injectable({
  providedIn: 'root' // Rende il servizio disponibile a livello globale
})
export class AuthService {

  constructor() { }

  /**
   * Simula la registrazione di un nuovo utente.
   * @param userData Dati dell'utente da registrare (nome, cognome, email, password, ruolo).
   * @returns Un Observable che emette una risposta di successo o un errore.
   */
  register(userData: UserData): Observable<any> {
    console.log('[AuthService Mock] Tentativo di registrazione:', userData);

    // Simulazione email già in uso
    if (userData.email === 'test@test.com') {
      console.warn('[AuthService Mock] Registrazione fallita: Email già in uso');
      // Simula un errore HTTP 409 (Conflict) dopo 1 secondo
      return throwError(() => ({ status: 409, message: 'Email già in uso' })).pipe(
        delay(1000) // Ritardo per simulare la chiamata di rete
      );
    }

    // Simulazione successo
    console.log('[AuthService Mock] Registrazione riuscita (simulata)');
    const mockResponse = {
      success: true,
      message: 'Registrazione completata con successo!',
      user: {
        id: Date.now(), // ID utente fittizio
        nome: userData.nome,
        cognome: userData.cognome,
        email: userData.email,
        ruolo: userData.ruolo
      }
    };

    // Simula una risposta di successo dopo 1.5 secondi
    return of(mockResponse).pipe(
      delay(1500), // Ritardo per simulare la chiamata di rete
      tap(response => console.log('[AuthService Mock] Risposta simulata:', response))
    );
    // --- Fine Simulazione ---
  }

}