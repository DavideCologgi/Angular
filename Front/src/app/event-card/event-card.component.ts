import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {
	
  constructor() {
  }
  @Input() event: any; // Dichiara un input property 'event' per ricevere i dati dall'esterno

}

