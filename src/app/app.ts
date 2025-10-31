import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {

  constructor(private http:HttpClient) {
    this.http.get("api/userinformation").subscribe(
      {
        next: (response: any)=>
        {
          const role = response.role;
          let user = response;
          // Salva ruolo e token
          localStorage.setItem('userRole', role);

        },
        error: (err) => {

        }
      })
  }
}
