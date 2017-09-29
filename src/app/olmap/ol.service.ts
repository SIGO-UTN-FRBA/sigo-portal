import {Injectable} from '@angular/core';
import * as ol from 'openlayers';


@Injectable()
export class OlService {

  get(): any {
    return ol;
  }
}
