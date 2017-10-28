import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {EnumItem} from "../commons/enumItem";
import {AppSettings} from "../main/app-settings";
import {RuleICAOAnnex14} from "./ruleICAO";
import {ListItem} from "../commons/listItem";

@Injectable()

export class RegulationIcaoService extends ApiService {

  constructor(http:Http){super(http)}

  getRules() : Promise<RuleICAOAnnex14[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/0/rules`)
      .toPromise()
      .then((response) => response.json() as RuleICAOAnnex14[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayCategories() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/0/runwayCategories`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayClassifications() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/0/runwayClassifications`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayCodeLetters() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/0/runwayCodeLetters`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayCodeNumbers() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/0/runwayCodeNumbers`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  searchSurfaces(classification: number, category: number, code:number) : Promise<ListItem[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/0/surfaces?classification=${classification}&category=${category}&number=${code}&recommendations=false`)
      .toPromise()
      .then(response => response.json() as ListItem[])
      .catch(this.handleError)
  }
}
