import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RedirectService } from '../redirect.service';

@Component({
	selector: 'app-filter-form',
	templateUrl: './filter-form.component.html',
	styleUrls: ['./filter-form.component.css']
})
export class FilterFormComponent {
	toppings = new FormControl([]);
	toppingList: string[] = ['Party',
		'Gym',
		'Rolegame',
		'Sport',
		'Meeting',
		'Conference',
		'Networking',
		'Hobby',
		'Music',
		'Business',
		'Food',
		'Nightlife',
		'Health',
		'Holidays'];
	filtro: any = {
		Titolo: '',
		Luogo: '',
		startDate: null,
		endDate: null,
		Categoria: []
	};
	private redirectTo: string;

	constructor(private router: Router, private route: ActivatedRoute, private redirectService: RedirectService) {
		this.redirectTo = redirectService.getRedirect();
	}
	applicaFiltro() {
		this.router.navigate(['/event-board'], { relativeTo: this.route, queryParams: { filtro: JSON.stringify(this.filtro) } });
	}
}
