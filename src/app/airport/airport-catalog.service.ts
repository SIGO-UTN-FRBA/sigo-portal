import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {AirportRegulation} from "./airportRegulation";
import {AppSettings} from "../main/app-settings";
import {ApiService} from "../main/api.service";

@Injectable()
export class AirportCatalogService extends ApiService {

  constructor(http : Http){super(http)}

  listRegulations() : Promise<AirportRegulation[]> {
      return this.http
        .get(`${AppSettings.API_ENDPOINT}/catalogs/airports/regulations`)
        .toPromise()
        .then(response => response.json() as AirportRegulation[])
        .catch(this.handleError)
  }
}
