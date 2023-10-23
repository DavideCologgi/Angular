import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosService } from '../axios.service';
import { RedirectService } from '../redirect.service';
import { HostListener } from '@angular/core';

@Injectable()
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  redirection = '';
  isLogged: boolean = false;
  numeroNotifiche: any;
  imageName: string = '/assets/title.png';
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private axiosService: AxiosService,
    private redirectService: RedirectService
  ) {
    this.numeroNotifiche = 5;
	this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMobile = window.innerWidth < 768;
  }

  logout() {
    this.axiosService
      .request2('POST', 'api/auth/logout', {})
      .then((response) => {
        this.isLogged = false;
        //not logged
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  setIsLogged(bool: boolean) {
    this.isLogged = bool;
  }

  updateRedirection(newRedirection: string) {
    this.redirection = newRedirection;
  }

  authenticate() {
    this.axiosService
      .request('POST', 'api/authenticate', {})
      .then((response) => {
        console.log('test');
        this.router.navigate([this.redirection]);
      })
      .catch((error) => {
        console.log('error');
        this.router.navigate(['/login']);
      });
  }

  resetNumeroNotifiche() {
    this.numeroNotifiche = 0;
  }

  navigateTo(route: string) {
    this.redirectService.setRedirect(route);
    this.router.navigate([route]);
  }

  navigateToMyEvents() {
    this.redirectService.setRedirect('/my-events');
    console.log(this.redirectService.getRedirect());
    this.router.navigate(['/event-board']);
  }

  navigateToRegisteredEvents() {
    this.redirectService.setRedirect('/registered-events');
    console.log(this.redirectService.getRedirect());
    this.router.navigate(['/event-board']);
  }

}
