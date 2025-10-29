import { Component, EventEmitter, Output, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nuovo-messaggio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close()"></div>
    <div #modal class="modal" (click)="$event.stopPropagation()">
      <header class="modal-header" (mousedown)="startDrag($event)">
        <h2>Nuovo messaggio</h2>
        <div class="window-controls">
          <button class="control-btn" title="Massimizza" (click)="toggleMaximize()">🗗</button>
          <button class="control-btn close" (click)="close()">✖</button>
        </div>
      </header>

      <form (ngSubmit)="sendMessage()" #form="ngForm" class="compose-form">
        <div class="field">
          <label>A:</label>
          <input type="text" [(ngModel)]="message.sender" name="sender" placeholder="Destinatario" required />
        </div>

        <div class="field">
          <label>Oggetto:</label>
          <input type="text" [(ngModel)]="message.subject" name="subject" placeholder="Oggetto" required />
        </div>

        <div class="attachments">
          <label class="attach-btn">
            📎 Allegati
            <input type="file" multiple (change)="onFilesSelected($event)" />
          </label>
          <ul *ngIf="attachments.length > 0">
            <li *ngFor="let file of attachments">{{ file.name }}</li>
          </ul>
        </div>

        <div class="toolbar">
          <button type="button" (click)="format('bold')"><b>B</b></button>
          <button type="button" (click)="format('italic')"><i>I</i></button>
          <button type="button" (click)="format('underline')"><u>U</u></button>
          <button type="button" (click)="format('insertUnorderedList')">• List</button>
          <button type="button" (click)="format('insertOrderedList')">1.</button>
        </div>

        <div class="editor" contenteditable="true" (input)="updateContent($event)" placeholder="Scrivi il tuo messaggio..."></div>

        <footer class="modal-footer">
          <button type="submit" class="send-btn">Invia</button>
          <button type="button" class="cancel-btn" (click)="close()">Annulla</button>
        </footer>
      </form>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 1000;
    }

    .modal {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 500px;
      max-width: 95%;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 1001;
      cursor: default;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .modal.closing {
      transform: scale(0.8);
      opacity: 0;
    }

    .modal-header {
      background: #f1f3f4;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      cursor: move;
    }

    .window-controls {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .control-btn {
      background: transparent;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .control-btn:hover {
      background: #e8f0fe; /* hover standard */
    }

    .control-btn.close:hover {
      background: #f28b82; /* hover rosso per chiudi */
      color: white;
    }

    .compose-form { display: flex; flex-direction: column; padding: 1rem; }
    .field { margin-bottom: 0.75rem; display: flex; flex-direction: column; }
    .field label { font-size: 0.85rem; color: #666; margin-bottom: 0.3rem; }
    .field input { border: 1px solid #ddd; border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.95rem; }
    .field input:focus { border-color: #1a73e8; outline: none; box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2); }

    .toolbar { display: flex; gap: 0.5rem; margin-bottom: 0.25rem; border: 1px solid #ddd; border-radius: 6px; padding: 0.25rem; background: #fafafa; }
    .toolbar button { background: transparent; border: none; font-size: 0.9rem; cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 4px; }
    .toolbar button:hover { background: #e8f0fe; }

    .editor { border: 1px solid #ddd; border-radius: 6px; min-height: 150px; padding: 0.75rem; font-size: 0.95rem; line-height: 1.5; outline: none; margin-top: 0.25rem; }
    .editor:empty:before { content: attr(placeholder); color: #999; }

    .attachments { margin-top: 0.25rem; }
    .attach-btn { display: inline-block; background: #f1f3f4; border: 1px solid #ddd; padding: 0.4rem 0.8rem; border-radius: 20px; cursor: pointer; font-size: 0.9rem; }
    .attach-btn input { display: none; }
    .attachments ul { margin-top: 0.25rem; list-style: none; padding: 0; font-size: 0.85rem; color: #444; }
    .attachments li { margin-bottom: 0.25rem; }

    .modal-footer { display: flex; justify-content: flex-end; align-items: center; gap: 0.5rem; border-top: 1px solid #eee; margin-top: 0.25rem; padding-top: 0.75rem; }
    .send-btn { background-color: #1a73e8; color: white; border: none; padding: 0.5rem 1.25rem; border-radius: 20px; cursor: pointer; font-weight: 500; }
    .send-btn:hover { background-color: #0b5ed7; }
    .cancel-btn { background: transparent; border: none; color: #555; cursor: pointer; font-size: 0.9rem; }

    .maximized {
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100% !important;
      height: 100% !important;
      border-radius: 0 !important;
    }
  `]
})
export class NuovoMessaggioComponent implements AfterViewInit {
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('modal') modal!: ElementRef<HTMLDivElement>;

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
  }

  stopDrag = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseup', this.stopDrag);
  }

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
