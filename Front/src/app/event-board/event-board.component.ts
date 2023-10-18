import { Component } from '@angular/core';

@Component({
  selector: 'app-event-board',
  templateUrl: './event-board.component.html',
  styleUrls: ['./event-board.component.css']
})
export class EventBoardComponent {
  events: any[] = []; // Inizializza l'array degli eventi

  constructor() {
    // Esempio di caricamento dei dati degli eventi da una sorgente (puoi farlo in un metodo separato)
    this.loadEvents();
  }

  loadEvents() {
    // Simulazione di caricamento dati da un servizio o sorgente dati
    // Esempio: sostituisci con la logica per ottenere gli eventi dal tuo servizio
    this.events = [
      {
        id: 1,
        title: 'Evento 1',
        category: 'Social',
        description: 'Descrizione dell\'evento 1',
        address: 'Indirizzo 1',
        date: '2023-10-20T20:00:00'
      },
      {
        id: 2,
        title: 'Evento 2',
        category: 'Sport',
        description: 'Descrizione dell\'evento 2',
        address: 'Indirizzo 2',
        date: '2023-10-22T18:30:00'
      },
	  {
        id: 3,
        title: 'Evento 3',
        category: 'Sport',
        description: 'Descrizione dell\'evento 2',
        address: 'Indirizzo 2',
        date: '2023-10-22T18:30:00'
      }
      // Aggiungi altri eventi qui
    ];
  }
}
