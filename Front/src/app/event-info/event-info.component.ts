import {Component} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatListModule} from '@angular/material/list';

@Component({
	selector: 'app-event-info',
	templateUrl: './event-info.component.html',
	styleUrls: ['./event-info.component.css'],
	standalone: true,
	imports: [MatButtonModule, MatDialogModule,MatCardModule,MatIconModule,CommonModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

	deleteEvent() {
		// logica cancellazione evento
	}

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(PeopleList);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
	selector: 'dialog-content-example-dialog',
	templateUrl: './people-list.html',
	standalone: true,
	imports: [MatDialogModule, MatButtonModule,MatListModule],
  })
  export class PeopleList {

  }
