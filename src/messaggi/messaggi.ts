import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NuovoMessaggioComponent} from './modaleNuovoMessaggio/nuovo-messaggio.component';
import {NavbarComponent} from '../parts/navbar/navbar';

interface Message {
  sender: string;
  subject: string;
  time: string;
  unread?: boolean;
  content: string;
}

interface Notification {
  title: string;
  description: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-messaggi',
  standalone: true,
  imports: [CommonModule, NuovoMessaggioComponent, NavbarComponent],
  templateUrl: './messaggi.html',
  styleUrls: ['./messaggi.scss']
})
export class Messaggi {
  role: string = '';
  view: 'inbox' | 'notifications' = 'inbox';

  // filtro notifiche: 'all' | 'read' | 'unread'
  notifFilter: 'all' | 'read' | 'unread' = 'all';


  showNewMessageModal = false;

  openNewMessage() {
    this.showNewMessageModal = true;
  }

  closeNewMessageModal() {
    this.showNewMessageModal = false;
  }

  get filteredNotifications() {
    if (this.notifFilter === 'all') return this.notifications;
    if (this.notifFilter === 'read') return this.notifications.filter(n => n.read);
    return this.notifications.filter(n => !n.read);
  }

  setFilter(filter: 'all' | 'read' | 'unread') {
    this.notifFilter = filter;
  }

  notifications: Notification[] = [
    { title: 'Sistema aggiornato', description: 'La piattaforma è stata aggiornata alle 10:00', time: 'Oggi, 10:05', read: false },
    { title: 'Nuovo messaggio', description: 'Hai ricevuto un messaggio da Luca', time: 'Ieri, 18:20', read: true },
    { title: 'Promozione speciale', description: 'Sconto del 20% sui tuoi prossimi ordini', time: '20 ott', read: false },
  ];

  selectedMessage?: Message;
  messages: any;

  setView(viewName: 'inbox' | 'notifications') {
    this.view = viewName;
    this.selectedMessage = undefined;
  }

  selectMessage(msg: Message) {
    this.selectedMessage = msg;
    if (msg.unread) msg.unread = false;
  }

  toggleRead(notif: Notification) {
    notif.read = !notif.read;
  }

}
