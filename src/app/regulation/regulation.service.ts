import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {AppSettings} from "../main/app-settings";
import "rxjs/add/operator/toPromise";
import {Regulation} from "./regulation";
import {AuthHttp} from 'angular2-jwt';

@Injectable()

export class RegulationService extends ApiService {

  constructor(http : AuthHttp){super(http)}

  get(regulationId:number): Promise<Regulation> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/regulations/${regulationId}`)
      .toPromise()
      .then(response => response.json() as Regulation)
      .catch(this.handleError)
  }

  types():RegulationType[]{
    return [
      { name: 'ICAO Annex 14', code: 'icao14', ordinal: 0},
      { name: 'EASA', code: 'easa', ordinal: 1},
      { name: 'BMVBW (Germany)', code: 'bmvbw', ordinal: 2},
      { name: 'TP 312 4th (Canada)', code: 'canada4', ordinal: 3},
      { name: 'TP 312 5th (Canada)', code: 'canada5', ordinal: 4},
      { name: 'FAA - CFR Part 77', code: 'faa77', ordinal: 5},
      { name: 'FAA - AC150-5300-13A', code: 'faa13a', ordinal: 6},
      { name: 'FAA - AC150-5300-18B', code: 'faa18b', ordinal: 7}
    ];
  }
}

export interface RegulationType{
  name: string;
  code:string;
  ordinal:number;
}
