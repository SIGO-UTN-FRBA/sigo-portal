import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Airport} from "./airport";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "../main/app-settings";
import Point = ol.geom.Point;
import {ApiService} from "../main/api.service";
import {ParamMap} from "@angular/router";
import {Feature} from "openlayers";
import JSONFeature = ol.format.JSONFeature;
import GeoJSON = ol.format.GeoJSON;


@Injectable()
export class AirportService extends ApiService {

  constructor (http : Http){super(http);}

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

  delete(airportId: number) : Promise<void> {
    return this.http
      .delete(`${AppSettings.API_ENDPOINT}/airports/${airportId}`)
      .toPromise()
      .then(()=> null)
      .catch(this.handleError);
  }

  getFeature(airportId : number) : Promise<Feature> {

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/feature`)
      .toPromise()
      .then(response => new GeoJSON().readFeature(response.json()))
      .catch(this.handleError)
  }

  updateFeature(airportId : number, point : Point) : Promise<Point>{

    let jsonGeom = JSON.parse(new GeoJSON().writeGeometry(point));

    return this.http
      .patch(`${AppSettings.API_ENDPOINT}/airports/${airportId}/feature`, {geometry: jsonGeom})
      .toPromise()
      .then(response => response.json() as Point)
      .catch(this.handleError)
  }
}
