import {Injectable} from "@angular/core";
import {AppSettings} from "../main/app-settings";
import {ApiService} from "../main/api.service";
import "rxjs/add/operator/toPromise";
import {EnumItem} from "../commons/enumItem";
import {AuthHttp} from 'angular2-jwt';

@Injectable()

export class RunwayCatalogService extends ApiService {

  constructor(http: AuthHttp) {super(http)}

  listSurfaces() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/airports/runways/surfaces`)
      .toPromise()
      .then(response => response.json() as EnumItem[])
      .catch(this.handleError);
  }

}
