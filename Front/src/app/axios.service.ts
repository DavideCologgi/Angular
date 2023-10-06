import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  constructor() {
    axios.defaults.baseURL = "http://localhost:8080"
    axios.defaults.headers.post["Content-Type"] = "application/json"
   }

	getAuthToken() : string | null {
		return window.localStorage.getItem("access_token");
	}

	setAuthToken(token : string | null): void {
		if (token !== null) {
			window.localStorage.setItem("access_token", token);
		} else {
			window.localStorage.removeItem("access_token");
		}
	}

  request(method: string, url: string, data: any): Promise<any> {
    let headers = {};

    if (this.getAuthToken() !== null) {
      headers = {"Authorization": "Bearer " + this.getAuthToken()};
      // this.setAuthToken(null);
      console.log(this.getAuthToken()?.length);
    }

    return axios({
      method: method,
      url: url,
      data: data,
      headers : headers
    });
  }

}
