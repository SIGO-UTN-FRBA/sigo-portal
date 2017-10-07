import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {RunwayDirection} from "./runwayDirection";
import {AppSettings} from "../main/app-settings";

@Injectable()

export class DirectionService{

  constructor(
    private http : Http
  ){}

  list(airportId : number, runwayId: number) : Promise<RunwayDirection[]>{
      return this.http
        .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions`)
        .toPromise()
        .then(response => response.json() as RunwayDirection[])
  }

  get(airportId : number, runwayId: number, directionId : number) : Promise<RunwayDirection>{
      return this.http
        .get(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${directionId}`)
        .toPromise()
        .then(response => response.json() as RunwayDirection);
  }

  save(airportId : number, runwayId: number, direction : RunwayDirection) : Promise<RunwayDirection> {
      return this.http
        .post(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions`, direction)
        .toPromise()
        .then( response => response.json() as RunwayDirection)
  }

  update(airportId : number, runwayId: number, direction: RunwayDirection) : Promise<RunwayDirection> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/airports/${airportId}/runways/${runwayId}/directions/${direction.id}`, direction)
      .toPromise()
      .then( response => response.json() as RunwayDirection)
  }
}
