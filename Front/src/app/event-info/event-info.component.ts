import {CUSTOM_ELEMENTS_SCHEMA, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { ActivatedRoute, Route, Router } from '@angular/router'; // Importa ActivatedRoute per ottenere il parametro ID
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AxiosService } from '../axios.service';
import { AxiosResponse } from 'axios';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule,MatCardModule,MatIconModule,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventInfoComponent implements OnInit {
  event: any;

  registrationButtonLabel: string = 'Register';
  isRegistered: boolean = false;
  showPeopleList: boolean = false;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute, // Inietta ActivatedRoute
    private axiosService: AxiosService,
    private router: Router
  ) {}

  ngOnInit() {
	if (!this.event) {
		// Se l'evento non è stato fornito, crea un evento di esempio
		this.event = {
		  id: '0',
		  title: 'Evento di esempio',
		  category: 'Esempio',
		  description: 'Questo è un evento di esempio.',
		  address: 'Indirizzo di esempio',
		  date: new Date().toISOString(),
		  // image:
		};
	  }
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.axiosService.request("GET", `/api/event/findById/${id}`, {})
        .then(response => {
          console.log("OK");
          this.event = response.data;
          console.log(this.event);
          const imageURLs = this.event.imageURL;
          const imageURLPromises = imageURLs.map((url: string) => this.loadURL(url));
          Promise.all(imageURLPromises)
            .then(urls => {
              this.event.imageURL = urls;
            })
            .catch(error => {
              console.error('Error loading image URLs:', error);
            });
          if (this.isAlreadyLogged(this.event.participants, window.localStorage.getItem("userId")) === true) {
            console.log(true);
            this.isRegistered = true;
          } else {
            console.log(false);
            this.isRegistered = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    });

  }

  loadURL(endpoint: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.axiosService.customGet(endpoint)
        .subscribe((response: AxiosResponse) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(response.data);
        }, (error) => {
          console.error('Error retrieving the image:', error);
          reject(error);
        });
    });
  }

  isAlreadyLogged(participants: Array<any>, userId: string | null): boolean {
    if (!userId) {
      return false;
    }

    for (const participant of participants) {
      if (participant.id.toString() === userId) {
        return true;
      }
    }

    return false;
  }

  toggleRegistration() {
    this.route.params.subscribe(params => {
      const eventId = +params['id'];
      const userId = window.localStorage.getItem("userId");
      this.isRegistered = !this.isRegistered;
      this.registrationButtonLabel = this.isRegistered ? 'Unregister' : 'Register';

      // chiamata per aggiungere partecipante

      if (this.isRegistered) {
        this.axiosService.request("POST", `/api/event/${eventId}/register/${userId}`, {})
      } else {
        this.axiosService.request("DELETE", `/api/event/${eventId}/unregister/${userId}`, {})
      }

      // altra per aggiornare la lista

      console.log("richiesta lista registrati");

      this.axiosService.request("GET", `/api/event/findById/${eventId}`, {})
      .then(response => {
        console.log("OK");
        this.event.participants = response.data;
        console.log(this.event.participants);
      }).catch(error => {
        console.log(error);
      });


      const message = this.isRegistered ? 'Registered for the event.' : 'Unregistered from the event.';
    });
  }

  getButtonClass() {
    return this.isRegistered ? 'red-button' : 'join-button';
  }

  deleteEvent() {
    // Qui puoi inserire la logica per la cancellazione dell'evento
    // Ad esempio, puoi aprire un dialogo di conferma per la cancellazione
    // e gestire l'eliminazione effettiva dell'evento
    console.log("deleting event...");

    this.route.params.subscribe(params => {
      const eventId = +params['id'];
      this.axiosService.request("DELETE", `/api/event/delete/${eventId}`, {})
      .then(response => {
        this.router.navigate(['/event-board']);
      })
    })

    console.log("event eliminated");
  }

  openDialog() {

    // this.event.participants è la lista dei partecipanti e ogni participant coniente un participant.name che va mostrato
    const dialogRef = this.dialog.open(PeopleList);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editEvent() {
	this.route.params.subscribe(params => {
	  const eventId = +params['id'];
	  this.router.navigate(['/event-edit']);
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
