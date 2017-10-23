import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {EnumItem} from "../commons/enumItem";
import {AppSettings} from "../main/app-settings";

@Injectable()

export class RegulationFaaService extends ApiService {

  constructor(http:Http){super(http)}

  listFAAAircraftApproachCategories() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/faa/aircraftApproachCategories`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listFAAAircraftClassifications() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/faa/aircraftClassifications`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listFAAAircraftDesignGroups() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/faa/aircraftDesignGroups`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listFAARunwaysCategories() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/faa/runwaysCategories`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listFAARunwaysClassifications() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/faa/runwaysClassifications`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listFAARunwaysTypes() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/faa/runwaysTypes`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }
}
