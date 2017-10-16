import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {RunwayDirection} from "./runwayDirection";
import {AppSettings} from "../main/app-settings";
import Point = ol.geom.Point;
import {RunwayApproachSection} from "./runwayApproachSection";
import {RunwayTakeoffSection} from "./runwayTakeoffSection";
import {RunwayDistance} from "./runwayDistance";
import {ApiService} from "../main/api.service";
import Polygon = ol.geom.Polygon;

@Injectable()

export class DirectionService extends ApiService {

  constructor(http : Http){super(http)}

  list(airportId : number, runwayId: number) : Promise<RunwayDirection[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions`)
      .toPromise()
      .then(response => response.json() as RunwayDirection[])
      .catch(this.handleError)
  }

  get(airportId : number, runwayId: number, directionId : number) : Promise<RunwayDirection>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}`)
      .toPromise()
      .then(response => response.json() as RunwayDirection)
      .catch(this.handleError)
  }

  save(airportId : number, runwayId: number, direction : RunwayDirection) : Promise<RunwayDirection> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions`, direction)
      .toPromise()
      .then( response => response.json() as RunwayDirection)
      .catch(this.handleError)
  }

  delete(airportId: number, runwayId: number, directionId: number) {
    return this.http
      .delete(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}`)
      .toPromise()
      .then(response => null)
      .catch(this.handleError)
  }

  update(airportId : number, runwayId: number, direction: RunwayDirection) : Promise<RunwayDirection> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${direction.id}`, direction)
      .toPromise()
      .then( response => response.json() as RunwayDirection)
      .catch(this.handleError)
  }

  getGeom(airportId : number, runwayId: number, directionId : number) : Promise<Point> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/geometry`)
      .toPromise()
      .then(response => response.json() as Point)
      .catch(this.handleError)
  }

  saveGeom(airportId : number, runwayId: number, directionId : number, geom : Point) : Promise<Point> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/geometry`, geom)
      .toPromise()
      .then(response => response.json() as Point)
      .catch(this.handleError)
  }

  getApproachSection(airportId : number, runwayId: number, directionId : number) : Promise<RunwayApproachSection> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/sections/approach`)
      .toPromise()
      .then(response => response.json() as RunwayApproachSection)
      .catch(this.handleError)
  }

  updateApproachSection(airportId: number, runwayId: number, directionId: number, section: RunwayApproachSection) : Promise<RunwayApproachSection> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/sections/approach`, section)
      .toPromise()
      .then(response => response.json() as RunwayApproachSection)
      .catch(this.handleError)
  }

  getTakeoffSection(airportId : number, runwayId: number, directionId : number) : Promise<RunwayTakeoffSection> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/sections/takeoff`)
      .toPromise()
      .then(response => response.json() as RunwayTakeoffSection)
      .catch(this.handleError)
  }

  updateTakeoffSection(airportId: number, runwayId: number, directionId: number, section: RunwayTakeoffSection) : Promise<RunwayTakeoffSection> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/sections/takeoff`, section)
      .toPromise()
      .then(response => response.json() as RunwayTakeoffSection)
      .catch(this.handleError)
  }

  listDistances(airportId: number, runwayId: number, directionId: number) : Promise<RunwayDistance[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/distances`)
      .toPromise()
      .then(response => response.json() as RunwayDistance[])
      .catch(this.handleError)
  }

  getDisplacedThresholdGeom(airportId: number, runwayId: number, directionId: number) : Promise<Polygon> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/sections/approach/geometries/threshold`)
      .toPromise()
      .then(response => response.json() as Polygon)
      .catch(this.handleError)
  }
}
