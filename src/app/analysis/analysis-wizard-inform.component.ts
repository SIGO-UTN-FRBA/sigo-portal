import {Component, OnInit, ViewChild} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {BlockTemplateComponent} from '../commons/block-template.component';
import {ApiError} from '../main/apiError';
import {AppError} from '../main/ierror';
import {OlComponent} from '../olmap/ol.component';
import Map = ol.Map;
import {AnalysisWizardService} from './analysis-wizard.service';
import {ActivatedRoute, Router} from '@angular/router';
import {STATUS_INDICATOR} from '../commons/status-indicator';

@Component({
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.inform.title">Analysis: Inform</ng-container>
      <small class="pull-right"><ng-container i18n="@@wizard.commons.stage">Stage</ng-container> 4/4</small>
    </h1>
    <p i18n="@@analysis.wizard.inform.main_description">
      This section allows users to study the final results of analysis.
    </p>

    <hr/>

    <div *ngIf="onSubmitError">
      <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
    </div>

    <block-ui [template]="blockTemplate" [delayStop]="500">

      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@analysis.wizard.inform.section.objects.title">
            Obstacles
          </h3>
        </div>
        <div [ngSwitch]="initObstaclesStatus" class="panel-body" style="max-height: 40em; overflow: auto;">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.EMPTY">
            <app-empty-indicator type="relation" entity="obstacles"></app-empty-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitObstaclesError]"></app-error-indicator>
          </div>
        </div>
      </div>

      <br>

      <nav>
        <ul class="pager">
          <li class="next">
            <a (click)="onFinish()" style="cursor: pointer">
              <ng-container i18n="@@commons.wizard.finalize">Finalize </ng-container>
              <span aria-hidden="true">&#9673;</span>
            </a>
          </li>
          <li class="previous">
            <a (click)="onPrevious()" style="cursor: pointer">
              <span aria-hidden="true">&#9668;</span>
              <ng-container i18n="@@commons.wizard.previous"> Previous</ng-container>
            </a>
          </li>
        </ul>
      </nav>
    </block-ui>
  `
})

export class AnalysisWizardInformComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  blockTemplate = BlockTemplateComponent;
  initStatus:number;
  initObstaclesStatus:number;
  initSpatialStatus:number;
  indicator;
  onInitError:ApiError;
  onInitObstaclesError:ApiError;
  onInitSpatialError:ApiError;
  onSubmitError:AppError;
  analysisId:number;
  private olmap: OlComponent;
  @ViewChild('mapObjects') set content(content: OlComponent) {
    this.olmap = content;
  }
  map:Map;

  constructor(
    private wizardService: AnalysisWizardService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.blockUI.stop();
    this.analysisId = this.route.snapshot.params['analysisId'];
    this.initStatus = STATUS_INDICATOR.LOADING;
    this.onInitError = null;
  }

  onFinish(){

    this.onSubmitError = null;

    this.blockUI.start("Processing...");

    //1. validate

    //2. perform

    this.wizardService
      .next(this.analysisId)
      .then( () =>{
        this.blockUI.stop();
        return this.router.navigate([`/analysis/${this.analysisId}/stages/inform`])
      })
      .catch((error) => {
        this.onSubmitError = error;
        this.blockUI.stop();
      });
  }

  onPrevious(){
    this.onSubmitError = null;

    this.wizardService
      .previous(this.analysisId)
      .then( () => this.router.navigate([`/analysis/${this.analysisId}/stages/analysis`]))
      .catch((error) => this.onSubmitError = error);
  }
}
