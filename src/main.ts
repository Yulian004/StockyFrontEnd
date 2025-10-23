import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { LoginComponent } from './login/LoginTs';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(LoginComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
