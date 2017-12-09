import {Injectable} from "@angular/core";
import {Runway} from "./runway";
import {AppSettings} from "../main/app-settings";
import Polygon = ol.geom.Polygon;
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import Feature = ol.Feature;
import GeoJSON = ol.format.GeoJSON;
import {RunwayStrip} from "./runwayStrip";

@Injectable()

export class RunwayService extends ApiService {

  constructor (protected http : Http){
    super(http);
  }

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

  getFeature(airportId: number, runwayId: number) : Promise<Feature>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/feature`)
      .toPromise()
      .then(response => new GeoJSON().readFeature(response.json()))
      .catch(this.handleError)
  }

  updateFeature(airportId: number, runwayId: number, polygon : Polygon) : Promise<Polygon>{

    let jsonGeom = JSON.parse(new GeoJSON().writeGeometry(polygon));

    return this.http
      .patch(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/feature`, {geometry: jsonGeom})
      .toPromise()
      .then(response => response.json() as Polygon)
      .catch(this.handleError)
  }

  getStrip(airportId: number, runwayId: number) : Promise<RunwayStrip> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/strip`)
      .toPromise()
      .then(response => response.json() as RunwayStrip)
      .catch(this.handleError)
  }

  updateStrip(airportId: number, runwayId: number, strip : RunwayStrip) : Promise<RunwayStrip> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/strip`, strip)
      .toPromise()
      .then(response => response.json() as RunwayStrip)
      .catch(this.handleError)
  }

  delete(airportId: number, runwayId : number) : Promise<void> {
    return this.http
      .delete(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}`)
      .toPromise()
      .then(()=> null)
      .catch(this.handleError)
  }
}
