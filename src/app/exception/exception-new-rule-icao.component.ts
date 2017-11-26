import {Component, OnInit} from "@angular/core";
import {AnalysisExceptionService} from "./analysis-exception.service";
import {ActivatedRoute} from "@angular/router";
import {RegulationIcaoService} from "../regulation/regulation-icao.service";
import {AppError} from "../main/ierror";
import {STATUS_INDICATOR} from "../commons/status-indicator";

@Component({
  template:`
    <h1>ICAO14</h1>
  `
})

export class ExceptionNewRuleIcao14Component implements OnInit {
  private analysisId: number;
  onInitStatus:number;
  indicator;
  onInitError:AppError;
  onSubmitStatus:AppError;

  constructor(
    private exceptionService:AnalysisExceptionService,
    private icaoService:RegulationIcaoService,
    private route:ActivatedRoute
  ){

  }

  ngOnInit(): void {

    this.onInitStatus=STATUS_INDICATOR.LOADING;
    this.onInitError=null;
    this.onSubmitStatus=null;

    this.analysisId = this.route.parent.snapshot.params['analysisId'];


  }

}
