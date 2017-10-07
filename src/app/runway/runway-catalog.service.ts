import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {RunwayDirectionPosition} from "../direction/runwayDirectionPosition";
import {RunwaySurface} from "./runwaySurface";
import {AppSettings} from "../main/app-settings";

@Injectable()

export class RunwayCatalogService{

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

  listSurfaces() : Promise<RunwaySurface[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalog/runways/surfaces`)
      .toPromise()
      .then(response => response.json() as RunwaySurface[]);
  }

}
