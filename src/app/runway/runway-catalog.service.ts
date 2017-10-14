import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {RunwaySurface} from "./runwaySurface";
import {AppSettings} from "../main/app-settings";
import {ApiService} from "../main/api.service";

@Injectable()

export class RunwayCatalogService extends ApiService {

  constructor(http: Http) {super(http)}

  listSurfaces() : Promise<RunwaySurface[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/airports/runways/surfaces`)
      .toPromise()
      .then(response => response.json() as RunwaySurface[])
      .catch(this.handleError);
  }

}
