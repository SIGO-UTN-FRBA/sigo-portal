import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {RunwaySurface} from "./runwaySurface";
import {AppSettings} from "../main/app-settings";

@Injectable()

export class RunwayCatalogService{

  constructor(private http: Http) {}

  listSurfaces() : Promise<RunwaySurface[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/airports/runways/surfaces`)
      .toPromise()
      .then(response => response.json() as RunwaySurface[]);
  }

}
