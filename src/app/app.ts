import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import {Navbar, NavbarComponent} from './components/parts/navbar/navbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  protected readonly title = signal('StockyFrontEnd');


  navigateToRegister() {
     this.router.navigate(['/register']);
  }

}
