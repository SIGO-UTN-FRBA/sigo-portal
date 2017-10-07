import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Region} from "./region";
import {AppSettings} from "../main/app-settings";

@Injectable()
export class RegionService {

  constructor(
    private http : Http
  ){}

  list() : Promise<Region[]> {
      return this.http
        .get(`${AppSettings.API_ENDPOINT}/regions`)
        .toPromise()
        .then( response => response.json() as Region[])
  }
}
