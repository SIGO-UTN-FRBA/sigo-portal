import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {AppSettings} from "../main/app-settings";
import {ApiService} from "../main/api.service";
import "rxjs/add/operator/toPromise";
import {EnumItem} from "../commons/enumItem";

@Injectable()

export class RunwayCatalogService extends ApiService {

  constructor(http: Http) {super(http)}

  listSurfaces() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/airports/runways/surfaces`)
      .toPromise()
      .then(response => response.json() as EnumItem[])
      .catch(this.handleError);
  }

}
