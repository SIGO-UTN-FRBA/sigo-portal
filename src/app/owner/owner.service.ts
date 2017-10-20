import {Injectable} from "@angular/core";
import {ListItem} from "../commons/listItem";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {AppSettings} from "../main/app-settings";
import {ObjectOwner} from "./objectOwner";
import "rxjs/add/operator/toPromise";

@Injectable()

export class ObjectOwnerService extends ApiService {

  constructor(http: Http){super(http)}

  list() : Promise<ListItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/owners`)
      .toPromise()
      .then(response => response.json() as ListItem[])
      .catch(this.handleError)
  }

  get(ownerId: number) : Promise<ObjectOwner> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/owners/${ownerId}`)
      .toPromise()
      .then(response => response.json() as ObjectOwner)
      .catch(this.handleError)
  }
}
