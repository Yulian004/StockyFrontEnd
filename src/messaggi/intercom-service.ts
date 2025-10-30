import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

export interface Message{
  sender:string,
  subject: string,
  content: string,
}
export interface NewMessage{
  message:Message,
  attachments:File[]
}

@Injectable({
  providedIn: 'root'
})
export class IntercomService {
  private apiUrl = '/api/messages'; // endpoint del backend (fittizio)

  constructor(private http: HttpClient) {}

  async sendMessage(newMessage: NewMessage) {
    // MOCK: simula una chiamata HTTP con ritardo di 1 secondo
    const mockResponse = {
      success: true,
      message: 'Messaggio inviato con successo (mock)',
      data: newMessage
    };

    return of(mockResponse).pipe(delay(1000)).toPromise();

    // todo quando l endpoint sarà pronto sostituiamo con questo
    // return this.http.post(`${this.apiUrl}`, newMessage).toPromise();
  }

}
