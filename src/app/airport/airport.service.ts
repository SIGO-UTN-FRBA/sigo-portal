import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Airport} from "./airport";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "../main/app-settings";


@Injectable()
export class AirportService {

  constructor(private http: Http) {}

  search(property: string, value : string) : Promise<Airport[]>{
    return this.http
              .get(`${AppSettings.API_ENDPOINT}/airports?${property}=${value}`)
              .toPromise()
              .then(response => response.json().data as Airport[])
              .catch(this.handleError)
  }

  get(id : number){
    return this.http
              .get(`${AppSettings.API_ENDPOINT}/airports/${id}`)
              .toPromise()
              .then(response => response.json().data as Airport)
              .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
