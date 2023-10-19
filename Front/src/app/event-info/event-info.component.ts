import {CUSTOM_ELEMENTS_SCHEMA, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute per ottenere il parametro ID
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule,MatCardModule,MatIconModule,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventInfoComponent implements OnInit {
  @Input() event: any;

  registrationButtonLabel: string = 'Register';
  isRegistered: boolean = false;
  showPeopleList: boolean = false;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute, // Inietta ActivatedRoute
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id']; // Recupera l'ID dall'URL
      // Ora puoi utilizzare l'ID per ottenere l'evento dai tuoi dati o API
      // Aggiungi qui la logica per ottenere l'evento in base all'ID
      // Ad esempio, puoi chiamare un servizio Axios o HTTP per ottenere l'evento
    });

    if (!this.event) {
      // Se l'evento non è stato fornito, crea un evento di esempio
      this.event = {
        id: '0',
        title: 'Evento di esempio',
        category: 'Esempio',
        description: 'Questo è un evento di esempio.',
        address: 'Indirizzo di esempio',
        date: new Date().toISOString()
      };
    }
  }

  toggleRegistration() {
    this.isRegistered = !this.isRegistered;
    this.registrationButtonLabel = this.isRegistered ? 'Unregister' : 'Register';

    const message = this.isRegistered ? 'Registered for the event.' : 'Unregistered from the event.';
    this.snackBar.open(message, 'Close', {
      duration: 2000
    });
  }

  getButtonClass() {
    return this.isRegistered ? 'red-button' : 'join-button';
  }

  deleteEvent() {
    // Qui puoi inserire la logica per la cancellazione dell'evento
    // Ad esempio, puoi aprire un dialogo di conferma per la cancellazione
    // e gestire l'eliminazione effettiva dell'evento
  }

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
