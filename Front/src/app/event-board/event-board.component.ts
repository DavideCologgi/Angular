import { Component, Input, OnInit } from '@angular/core';
import { AxiosService } from '../axios.service';
import { AxiosResponse } from 'axios';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-board',
  templateUrl: './event-board.component.html',
  styleUrls: ['./event-board.component.css'],
})
export class EventBoardComponent implements OnInit {
  constructor(private axiosService: AxiosService, public dialog: MatDialog, private route: ActivatedRoute) {}
  showFilterForm = false;
  events: any[] = [];
  filtro: any;

  ngOnInit() {
    console.log("Requesting events...");

    this.route.queryParams.subscribe((params) => {
      if (params['filtro']) {
        this.filtro = JSON.parse(params['filtro']);
        console.log(this.filtro);
        this.loadDataBasedOnFiltro();
		console.log(this.filtro.Titolo);
      }
    });
  }

  loadDataBasedOnFiltro() {
    if (this.filtro) {
      const filters = {
        Titolo: this.filtro.Titolo || '',
        Luogo: this.filtro.Luogo || '',
        startDate: this.filtro.startDate || '',
        endDate: this.filtro.endDate || '',
        category: this.filtro.Categoria || [],
      };

      this.axiosService.request("GET", "/api/user/all-events", { params: filters })
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
    }
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

  toggleFilterForm() {
    this.showFilterForm = !this.showFilterForm;
  }
}
