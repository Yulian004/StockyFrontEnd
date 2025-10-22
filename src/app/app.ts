import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet ],
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
