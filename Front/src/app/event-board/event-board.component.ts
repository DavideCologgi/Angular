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
  events: any[] = [
	{
	  title: 'Party Event 1',
	  category: 'PARTY',
	  description: 'This is a party event example.',
	  address: '123 Party Street, Party Town',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Gym Event 1',
	  category: 'GYM',
	  description: 'Join us for a fitness workout session.',
	  address: '456 Fitness Avenue, Fitness City',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Role Game Event 1',
	  category: 'ROLEGAME',
	  description: 'Enter the world of fantasy and adventure.',
	  address: '789 Fantasy Lane, Game Village',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Sport Event 1',
	  category: 'SPORT',
	  description: 'Let\'s play some sports and have fun.',
	  address: '101 Sports Drive, Sportsville',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Meeting Event 1',
	  category: 'MEETING',
	  description: 'Join us for a productive meeting.',
	  address: '222 Meeting Street, Conference Center',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Conference Event 1',
	  category: 'CONFERENCE',
	  description: 'A conference on interesting topics.',
	  address: '333 Conference Avenue, Seminar Hall',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Networking Event 1',
	  category: 'NETWORKING',
	  description: 'Connect and network with professionals.',
	  address: '444 Networking Lane, Business Park',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Hobby Event 1',
	  category: 'HOBBY',
	  description: 'Pursue your hobbies with like-minded people.',
	  address: '555 Hobby Road, Art Studio',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Music Event 1',
	  category: 'MUSIC',
	  description: 'Enjoy live music performances.',
	  address: '666 Music Street, Concert Hall',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Business Event 1',
	  category: 'BUSINESS',
	  description: 'A business networking event.',
	  address: '777 Business Avenue, Conference Center',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Food Event 1',
	  category: 'FOOD',
	  description: 'A food festival with delicious cuisines.',
	  address: '888 Food Lane, Food Park',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Nightlife Event 1',
	  category: 'NIGHTLIFE',
	  description: 'Enjoy the nightlife with music and dance.',
	  address: '999 Nightlife Road, Nightclub',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Health Event 1',
	  category: 'HEALTH',
	  description: 'Learn about health and wellness.',
	  address: '101 Health Drive, Wellness Center',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	},
	{
	  title: 'Holidays Event 1',
	  category: 'HOLIDAYS',
	  description: 'Celebrate the holiday season with us.',
	  address: '202 Holiday Street, Holiday Resort',
	  date: new Date().toISOString(),
	  imageURL: '/assets/background6.jpg'
	}
  ];


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
	console.log(this.filtro);
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
