import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {EnumItem} from "../commons/enumItem";
import {AppSettings} from "../main/app-settings";

@Injectable()

export class RegulationIcaoService extends ApiService {

  constructor(http:Http){super(http)}

  listICAOAnnex14RunwayCategories() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao/runwayCategories`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayClassifications() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao/runwayClassifications`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayCodeLetters() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao/runwayCodeLetters`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayCodeNumbers() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao/runwayCodeNumbers`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }
}
