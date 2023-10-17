import { Component } from '@angular/core';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css']
})
export class EventInfoComponent {

	registrationButtonLabel: string = 'Register';
	isRegistered: boolean = false;
	showPeopleList: boolean = false;

	toggleRegistration() {
		this.isRegistered = !this.isRegistered;
		this.registrationButtonLabel = this.isRegistered ? 'Unregister' : 'Register';
	}

  	getButtonClass() {
		return this.isRegistered ? 'red-button' : 'join-button';
	}

	togglePeopleList() {
		this.showPeopleList = !this.showPeopleList;
	}

	deleteEvent() {
		// logica cancellazione evento
	}
}
