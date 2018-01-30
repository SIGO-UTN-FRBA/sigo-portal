import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {EnumItem} from "../commons/enumItem";
import {AppSettings} from "../main/app-settings";
import {RuleICAOAnnex14} from "./ruleICAO";
import {ListItem} from "../commons/listItem";
import "rxjs/add/operator/toPromise";
import {AuthHttp} from 'angular2-jwt';

@Injectable()

export class RegulationIcaoService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  allRules() : Promise<RuleICAOAnnex14[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao14/rules`)
      .toPromise()
      .then((response) => response.json() as RuleICAOAnnex14[])
      .catch(this.handleError)
  }

  getRule(ruleId:number):Promise<RuleICAOAnnex14>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao14/rules/${ruleId}`)
      .toPromise()
      .then((response) => response.json() as RuleICAOAnnex14)
      .catch(this.handleError)
  }

  getRules(surfaceId:number, classification: number, category: number, code:number) : Promise<RuleICAOAnnex14[]> {

    let queryString:string[]=[];

    if(surfaceId != null)
      queryString.push(`surface=${surfaceId}`);
    if(classification != null)
      queryString.push(`classification=${classification}`);
    if(category!=null)
      queryString.push(`category=${category}`);
    if(code!=null)
      queryString.push(`number=${code}`);

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao14/rules?${queryString.join('&')}`)
      .toPromise()
      .then((response) => response.json() as RuleICAOAnnex14[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayCategories() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao14/runwayCategories`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayClassifications() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao14/runwayClassifications`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayCodeLetters() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao14/runwayCodeLetters`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listICAOAnnex14RunwayCodeNumbers() : Promise<EnumItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao14/runwayCodeNumbers`)
      .toPromise()
      .then((response) => response.json() as EnumItem[])
      .catch(this.handleError)
  }

  listICAOAnnex14Surfaces(): Promise<ListItem[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao14/surfaces`)
      .toPromise()
      .then(response => response.json() as ListItem[])
      .catch(this.handleError)
  }

  searchSurfaces(classification: number, category: number, code:number) : Promise<ListItem[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/icao14/surfaces?classification=${classification}&category=${category}&number=${code}&recommendations=false`)
      .toPromise()
      .then(response => response.json() as ListItem[])
      .catch(this.handleError)
  }
}
