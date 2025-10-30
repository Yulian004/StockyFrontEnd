import {
  Component,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IntercomService, NewMessage} from '../intercom-service';

@Component({
  selector: 'app-nuovo-messaggio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuovo-messaggio.component.html',
  styleUrls: ['./nuovo-messaggio.component.css'],
})
export class NuovoMessaggioComponent implements AfterViewInit {
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('modal') modal!: ElementRef<HTMLDivElement>;

  private intercomService = inject(IntercomService);

  message = { sender: '', subject: '', content: '' };
  attachments: File[] = [];

  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;
  isMaximized = false;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const modalEl = this.modal.nativeElement;
    modalEl.style.bottom = '2rem';
    modalEl.style.right = '2rem';
  }

  startDrag(event: MouseEvent) {
    if (this.isMaximized) return;
    event.preventDefault();
    this.isDragging = true;
    const rect = this.modal.nativeElement.getBoundingClientRect();
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;

    document.addEventListener('mousemove', this.drag);
    document.addEventListener('mouseup', this.stopDrag);
  }

  drag = (event: MouseEvent) => {
    if (!this.isDragging) return;
    const x = event.clientX - this.offsetX;
    const y = event.clientY - this.offsetY;

    const modalEl = this.modal.nativeElement;
    modalEl.style.left = `${x}px`;
    modalEl.style.top = `${y}px`;
    modalEl.style.bottom = 'auto';
    modalEl.style.right = 'auto';
  };

  stopDrag = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseup', this.stopDrag);
  };

  format(command: string) {
    document.execCommand(command, false);
  }

  updateContent(event: Event) {
    const target = event.target as HTMLElement;
    this.message.content = target.innerHTML;
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.attachments = Array.from(input.files);
    }
  }

  sendMessage() {
    console.log('Nuovo messaggio:', this.message);
    console.log('Allegati:', this.attachments);
    const messageBody:NewMessage = {
      message:this.message,
      attachments:this.attachments
    }
    this.intercomService.sendMessage(messageBody)
      .then(response => {
        console.log('Messaggio inviato con successo:', response);
      })
      .catch(error => {
        console.error('Errore durante l\'invio del messaggio:', error);
      });
    this.close();
  }

  close() {
    const modalEl = this.modal.nativeElement;
    this.renderer.addClass(modalEl, 'closing');
    setTimeout(() => {
      this.closeModal.emit();
    }, 300);
  }

  toggleMaximize() {
    const modalEl = this.modal.nativeElement;
    if (this.isMaximized) {
      modalEl.classList.remove('maximized');
      this.isMaximized = false;
    } else {
      modalEl.classList.add('maximized');
      this.isMaximized = true;
    }
  }
}
