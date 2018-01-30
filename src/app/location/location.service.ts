import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {ListItem} from "../commons/listItem";
import {AppSettings} from "../main/app-settings";
import "rxjs/add/operator/toPromise";
import {PoliticalLocation} from "./location";
import {AuthHttp} from 'angular2-jwt';

@Injectable()

export class LocationService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  list(locationType: string) : Promise<ListItem[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/locations?type=${locationType}`)
      .toPromise()
      .then(response => response.json() as ListItem[])
      .catch(this.handleError);
  }

  get(locationId: number) : Promise<PoliticalLocation> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/locations/${locationId}`)
      .toPromise()
      .then(response => response.json() as PoliticalLocation)
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
