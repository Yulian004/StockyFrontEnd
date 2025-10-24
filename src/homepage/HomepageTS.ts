import { Component } from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouterLink, RouterOutlet} from '@angular/router';
import {routes} from '../app/app.routes';
import {provideHttpClient} from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.html',
  imports: [
    RouterLink,
  ],
  styleUrls: ['./homepage.css']
})
export class HomepageComponent {}


