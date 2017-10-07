import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Runway} from "./runway";
import {AppSettings} from "../main/app-settings";
import LineString = ol.geom.LineString;

@Injectable()

export class RunwayService {

  constructor(private http: Http) {}

  list(airportId : number) : Promise<Runway[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways`)
      .toPromise()
      .then(response => response.json() as Runway[])
      .catch(this.handleError)
  }

  get(airportId : number, runwayId : number) : Promise<Runway>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}`)
      .toPromise()
      .then(response => response.json() as Runway)
      .catch(this.handleError)
  }

  save(airportId : number, runway : Runway) : Promise<Runway>{
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways`, runway)
      .toPromise()
      .then(response => response.json() as Runway)
      .catch(this.handleError)
  }

  update(airportId : number, runway : Runway) : Promise<Runway>{
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runway.id}`, runway)
      .toPromise()
      .then(response => response.json() as Runway)
      .catch(this.handleError)
  }

  getGeom(airportId: number, runwayId: number) : Promise<LineString>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/geometry`)
      .toPromise()
      .then(response => response.json() as LineString)
  }

  saveGeom(airportId: number, runwayId: number, geom : LineString) : Promise<LineString>{
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/geometry`, geom)
      .toPromise()
      .then(response => response.json() as LineString)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
