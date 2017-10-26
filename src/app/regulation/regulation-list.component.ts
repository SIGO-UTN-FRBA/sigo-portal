import {Component, OnInit} from "@angular/core";
import {ApiError} from "../main/apiError";
import {RegulationService} from "./regulation.service";
import {Regulation} from "./regulation";
import {STATUS_INDICATOR} from "../commons/status-indicator";

@Component({
  template:`
    <h1 i18n="@@regulation.search.title">
      Regulations
    </h1>
    <p i18n="@@airport.search.main_description">
      This section allows users to manage regulations.
    </p>
    <hr/>
    <div [ngSwitch]="status" class="container-fluid">
      <div *ngSwitchCase="indicator.LOADING">
        <app-loading-indicator></app-loading-indicator>
      </div>
      <div *ngSwitchCase="indicator.ERROR">
        <app-error-indicator [error]="onInitError"></app-error-indicator>
      </div>
      <ul *ngSwitchCase="indicator.ACTIVE" class="media-list">
        <li *ngFor="let regulation of regulations" class="media media-border">
          <div class="media-left">

          </div>
          <div class="media-body">
            <h4 class="media-heading">
              <a routerLink="/regulations/{{regulation.id}}/detail">{{regulation.name}}</a>
            </h4>
            <p>{{regulation.authority}}</p>
            <p>{{regulation.description}}</p>
          </div>
        </li>
      </ul>
    </div>
  `
})

export class RegulationListComponent implements OnInit {

  status:number;
  indicator;
  onInitError:ApiError;
  regulations:Regulation[];

  constructor(
    private regulationService:RegulationService
  ){
    this.indicator = STATUS_INDICATOR;
    this.regulations=[];
  }

  ngOnInit(): void {

    this.status = STATUS_INDICATOR.LOADING;
    this.onInitError=null;

    this.regulationService
      .list()
      .then(data => Promise.all(data.map(r => this.regulationService.get(r.id).then(r => this.regulations.push(r)))))
      .then(()=> this.status=STATUS_INDICATOR.ACTIVE)
      .catch(error=>{
        this.onInitError=error;
        this.status=STATUS_INDICATOR.ERROR;
      })
  }
}
