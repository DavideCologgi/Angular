import { Component } from '@angular/core';
import { AxiosService } from '../axios.service';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-event-board',
  templateUrl: './event-board.component.html',
  styleUrls: ['./event-board.component.css']
})
export class EventBoardComponent {
  constructor(private axiosService: AxiosService,public dialog: MatDialog) {}

  events: any[] = [];

  ngOnInit() {
    console.log("Requesting events...");
    this.axiosService.request("GET", "/api/user/all-events", {})
      .then(response => {
        console.log("OK");
        this.events = response.data;

        const imageLoadingPromises = this.events.map(event => this.loadURL(event.imageURL));

        Promise.all(imageLoadingPromises)
          .then(imageURLs => {
            imageURLs.forEach((imageURL, index) => {
              this.events[index].imageURL = imageURL;
            });

            console.log(this.events);
          })
          .catch(error => {
            console.error('Error loading images:', error);
          });
      })
      .catch(error => {
        console.log("Error");
      });
    console.log('Retrieved all events');
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



  openDialog() {
    const dialogRef = this.dialog.open(FilterForm);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
	selector: 'dialog-content-example-dialog',
	templateUrl: 'filter-form.html',
	standalone: true,
	imports: [MatDialogModule, MatButtonModule],
  })
  export class FilterForm {}
