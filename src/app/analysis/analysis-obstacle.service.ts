import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {AnalysisObstacle} from "./analysisObstacle";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "../main/app-settings";

@Injectable()
export class AnalysisObstacleService extends ApiService {

  constructor(http:Http){super(http)}

  list(analysisId: number):Promise<AnalysisObstacle[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/obstacles`)
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
