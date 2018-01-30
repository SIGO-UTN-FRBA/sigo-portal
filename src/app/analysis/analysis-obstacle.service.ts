import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {AnalysisObstacle} from "./analysisObstacle";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "../main/app-settings";
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class AnalysisObstacleService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  list(analysisId: number, excepting?: boolean):Promise<AnalysisObstacle[]>{

    let queryParams = (excepting !== null) ? `excepting=${excepting}` : "";

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/obstacles?${queryParams}`)
      .toPromise()
      .then(response => response.json() as AnalysisObstacle[])
      .catch(this.handleError)
  }

  get(analysisId: number, obstacleId: number):Promise<AnalysisObstacle>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/obstacles/${obstacleId}`)
      .toPromise()
      .then(response => response.json() as AnalysisObstacle)
      .catch(this.handleError)
  }
}
