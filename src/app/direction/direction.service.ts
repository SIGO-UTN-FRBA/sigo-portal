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
import "rxjs/add/operator/toPromise";
import Feature = ol.Feature;
import GeoJSON = ol.format.GeoJSON;
import {RunwayStrip} from "./runwayStrip";

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

  getFeature(airportId : number, runwayId: number, directionId : number) : Promise<Feature> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/feature`)
      .toPromise()
      .then(response => new GeoJSON().readFeature(response.json()))
      .catch(this.handleError)
  }

  updateFeature(airportId : number, runwayId: number, directionId : number, point : Point) : Promise<Point> {

    let jsonGeom = JSON.parse(new GeoJSON().writeGeometry(point));

    return this.http
      .patch(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/feature`, {geometry: jsonGeom})
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

  getDisplacedThresholdFeature(airportId: number, runwayId: number, directionId: number) : Promise<Feature> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/sections/approach/threshold/feature`)
      .toPromise()
      .then(response => new GeoJSON().readFeature(response.json()))
      .catch(this.handleError)
  }

  getStopwayFeature(airportId: number, runwayId: number, directionId: number) : Promise<Feature> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/sections/takeoff/stopway/feature`)
      .toPromise()
      .then(response => new GeoJSON().readFeature(response.json()))
      .catch(this.handleError)
  }

  getClearwayFeature(airportId: number, runwayId: number, directionId: number) : Promise<Feature> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/sections/takeoff/clearway/feature`)
      .toPromise()
      .then(response => new GeoJSON().readFeature(response.json()))
      .catch(this.handleError)
  }

  getStrip(airportId: number, runwayId: number, directionId:number) : Promise<RunwayStrip> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/strip`)
      .toPromise()
      .then(response => response.json() as RunwayStrip)
      .catch(this.handleError)
  }

  updateStrip(airportId: number, runwayId: number, directionId:number, strip : RunwayStrip) : Promise<RunwayStrip> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/strip`, strip)
      .toPromise()
      .then(response => response.json() as RunwayStrip)
      .catch(this.handleError)
  }
}
