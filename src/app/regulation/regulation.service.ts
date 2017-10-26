import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {AppSettings} from "../main/app-settings";
import {EnumItem} from "../commons/enumItem";
import "rxjs/add/operator/toPromise";
import {Regulation} from "./regulation";

@Injectable()

export class RegulationService extends ApiService {

  constructor(http : Http){super(http)}

  list() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations`)
      .toPromise()
      .then(response => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  get(regulationId:number): Promise<Regulation> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/${regulationId}`)
      .toPromise()
      .then(response => response.json() as Regulation)
      .catch(this.handleError)
  }
}
