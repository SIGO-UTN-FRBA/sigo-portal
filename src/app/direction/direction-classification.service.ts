import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {RunwayClassification} from "./runwayClassification";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "../main/app-settings";
import {AuthHttp} from 'angular2-jwt';

@Injectable()

export class DirectionClassificationService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  get(airportId:number, runwayId:number, directionId:number) : Promise<RunwayClassification> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/classification`)
      .toPromise()
      .then(response => response.json() as RunwayClassification)
      .catch(this.handleError)
  }

  update(airportId:number, runwayId:number, directionId:number, classification: RunwayClassification) : Promise<RunwayClassification> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}/classification`, classification)
      .toPromise()
      .then(response => response.json() as RunwayClassification)
      .catch(this.handleError)
  }
}
