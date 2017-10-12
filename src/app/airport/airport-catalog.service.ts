import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {AirportRegulation} from "./airportRegulation";
import {AppSettings} from "../main/app-settings";

@Injectable()
export class AirportCatalogService{

  constructor(
    private http : Http
  ){}

  listRegulations() : Promise<AirportRegulation[]> {
      return this.http
        .get(`${AppSettings.API_ENDPOINT}/catalogs/airports/regulations`)
        .toPromise()
        .then(response => response.json() as AirportRegulation[])
  }
}
