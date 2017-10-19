import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {ListItem} from "../commons/listItem";
import {Http} from "@angular/http";
import {AppSettings} from "../main/app-settings";

@Injectable()

export class LocationService extends ApiService {

  constructor(http:Http){super(http)}

  list(type: string) : Promise<ListItem[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/locations?type=${type}`)
      .toPromise()
      .then(response => response.json() as ListItem[])
      .catch(this.handleError);
  }

  listCountries(): Promise<ListItem[]> {
    return this.list('Pais');
  }

  listProvinces(): Promise<ListItem[]> {
    return this.list('Provincia');
  }

  listDepartaments(): Promise<ListItem[]> {
    return this.list('Departamento');
  }
}
