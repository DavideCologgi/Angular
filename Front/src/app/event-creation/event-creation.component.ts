import { Component } from '@angular/core';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.css'],
})
export class EventCreationComponent {
  newEvent: any = {}; // Modello di dati per il nuovo evento

  // Metodo chiamato quando il form viene inviato
  onSubmit() {
    // Invia il nuovo evento al database o a un servizio
    // Esempio: this.eventService.createEvent(this.newEvent);
  }
}
