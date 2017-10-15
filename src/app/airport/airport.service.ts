import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Airport} from "./airport";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "../main/app-settings";
import Point = ol.geom.Point;
import {ApiService} from "../main/api.service";
import {ParamMap} from "@angular/router";


@Injectable()
export class AirportService extends ApiService {

  constructor (protected http : Http){
    super(http);
  }

  search(paramMap : ParamMap) : Promise<Airport[]>{

    let queryString = paramMap.keys.reduce((total, key) => {return `${total}&${key}=${paramMap.get(key)}` }, '');

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports?${queryString}`)
      .toPromise()
      .then(response => response.json() as Airport[])
      .catch(this.handleError);
  }

  get(id : number) : Promise<Airport>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${id}`)
      .toPromise()
      .then(response => response.json() as Airport)
      .catch(this.handleError);
  }

  update(airport: Airport) : Promise<Airport> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/airports/${airport.id}`, airport)
      .toPromise()
      .then(response => response.json() as Airport)
      .catch(this.handleError)
  }

  save(airport: Airport) : Promise<Airport> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/airports`, airport)
      .toPromise()
      .then( response => response.json() as Airport)
      .catch(this.handleError)
  }

  getGeom(airportId : number) : Promise<Point> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/geometry`)
      .toPromise()
      .then(response => response.json() as Point)
      .catch(this.handleError)
  }

  saveGeom(airportId : number, geom : Point) : Promise<Point>{
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/airports/${airportId}/geometry`, geom)
      .toPromise()
      .then(response => response.json() as Point)
      .catch(this.handleError)
  }
}
