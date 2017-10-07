import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {AppSettings} from "../main/app-settings";
import {RunwayDirectionPosition} from "./runwayDirectionPosition";

@Injectable()

export class DirectionCatalogService{

  constructor(private http: Http) {}

  listPositions() : Promise<RunwayDirectionPosition[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalog/runways/directions/positions`)
      .toPromise()
      .then((response) => {
          let list = response.json() as Array<string>;
          return list.map((value, index, col)=> new RunwayDirectionPosition(index,value))
        }
      )
  }

}
