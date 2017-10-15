import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {PlacedObject} from "./object";
import {AppSettings} from "../main/app-settings";
import {ParamMap, Params} from "@angular/router";

@Injectable()
export class PlacedObjectService extends ApiService {

  constructor(http: Http){super(http)}

  search(paramMap : ParamMap) : Promise<PlacedObject[]> {

    let queryString = paramMap.keys.reduce((total, key) => {return `${total}&${key}=${paramMap.get(key)}` }, '');

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/objects?${queryString}`)
      .toPromise()
      .then(response => response.json() as PlacedObject[])
      .catch(this.handleError)
  }
}
