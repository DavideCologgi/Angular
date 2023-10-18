import { Component, ElementRef, AfterViewInit, Renderer2, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements AfterViewInit, OnInit {
  @Input() event: any;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (!this.event) {
      // Se l'evento non è stato fornito, crea un evento di esempio
      this.event = {
        title: 'Evento di esempio',
        category: 'Esempio',
        description: 'Questo è un evento di esempio.',
        address: 'Indirizzo di esempio',
        date: new Date().toISOString()
      };
    }
  }

  ngAfterViewInit() {
    // Ottieni l'elemento con width: auto; (l'elemento HTML del componente)
    const element = this.elementRef.nativeElement;

    // Calcola la larghezza effettiva in pixel
    const width = element.offsetWidth;

    // Puoi fare qualcosa con la larghezza, ad esempio, stamparla nella console
    console.log(`Larghezza effettiva: ${width}px`);
  }
}
