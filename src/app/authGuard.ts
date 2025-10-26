import { Injectable } from '@angular/core'; // Altro modo per Iniettare come servizio, stando a Reddit così funzia meglio
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root' // Rende AuthGaurd disponibile a tutto il progetto senza aggiungerlo ai providers,
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role']; // Vuole il ruolo
    const userRole = localStorage.getItem('userRole'); // Salva il ruolo

    // Se non loggato → torna al login
    if (!userRole) {
      this.router.navigate(['/']);
      return false;
    }

    // Se il ruolo non corrisponde → Il pagliaccio NON ENTRA
    if (userRole !== expectedRole) {
      alert('Accesso negato 🚫');
      this.router.navigate(['/' + userRole.toLowerCase()]); // reindirizza alla sua pagina corretta
      return false;
    }

    // Accesso consentito ✅
    return true;
  }
}
