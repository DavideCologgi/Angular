import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
	private redirectTo: string = '/event-board';
  constructor() {}

  setRedirect(route:string){
	this.redirectTo = route;
  }

  getRedirect(){
	return this.redirectTo;
  }

  isLogged: boolean = false;

  setIsLogged(bool: boolean) {
		this.isLogged = bool;
	}
}


