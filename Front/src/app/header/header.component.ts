import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosService } from '../axios.service';

@Injectable()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  redirection = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router, private axiosService: AxiosService) {}

  logout() {
    this.axiosService
      .request2("POST", "api/auth/logout", {})
      .then((response) => {
        this.isLoggedIn = false
        this.router.navigate(['/login'])
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  }

  setIsLoggedIn(boolean: boolean) {
    this.isLoggedIn = boolean;
  }

  updateRedirection(newRedirection: string) {
    this.redirection = newRedirection;
  }

  authenticate() {
    this.axiosService.request(
      "POST",
      "api/authenticate",
      {
      }
    ).then(response => {
          console.log("test");
            this.router.navigate([this.redirection]);
				})
			  .catch(error => {
          console.log("error");
        	this.router.navigate(['/login']);
			  })
  }
}
