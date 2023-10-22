import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.css']
})
export class FilterFormComponent {
  toppings = new FormControl([]);
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  filtro: any = {
    Titolo: '',
    Luogo: '',
    startDate: null,
    endDate: null,
    Categoria: []
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  applicaFiltro() {
    this.router.navigate(['/event-board'], { relativeTo: this.route, queryParams: { filtro: JSON.stringify(this.filtro) } });
  }
}