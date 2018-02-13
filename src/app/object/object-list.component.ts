import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ElevatedObjectService} from "./object.service";
import {ElevatedObject} from './elevatedObject';

@Component({
  template: `
    <div [ngSwitch]="status" class="container-fluid">

      <div *ngSwitchCase="indicator.LOADING">
        <app-loading-indicator></app-loading-indicator>
      </div>
      <div *ngSwitchCase="indicator.EMPTY">
        <app-empty-indicator type="result" entity="objects"></app-empty-indicator>
      </div>
      <div *ngSwitchCase="indicator.ERROR">
        <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
      </div>

      <ul *ngSwitchCase="indicator.ACTIVE" class="media-list">
        <li *ngFor="let result of results" class="media media-border">
          <div class="media-left">

          </div>
          <ng-container [ngSwitch]="result.typeId">
            <div class="media-body" *ngSwitchCase="0">
              <h4 class="media-heading">
                <a routerLink="/objects/placedObjects/{{result.id}}" [queryParams]="{ type : 0}">
                  {{result.name}}
                </a>
              </h4>
              <p>{{result['subtype']}}</p>
            </div>
            <div class="media-body" *ngSwitchCase="1">
              <h4 class="media-heading">
                <a routerLink="/objects/placedObjects/{{result.id}}" [queryParams]="{ type : 1}">
                  {{result.name}}
                </a>
              </h4>
              <p>{{result['subtype']}}</p>
            </div>
            <div class="media-body" *ngSwitchCase="2">
              <h4 class="media-heading">
                <a routerLink="/objects/placedObjects/{{result.id}}" [queryParams]="{ type: 2}">
                  {{result.name}}
                </a>
              </h4>
              <p>{{result['subtype']}}</p>
            </div>
            <div class="media-body" *ngSwitchCase="4">
              <h4 class="media-heading">
                <a routerLink="/objects/tracks/{{result.id}}">
                  {{result.name}}
                </a>
              </h4>
            </div>
          </ng-container>
        </li>
      </ul>
    </div>
  `
})

export class ObjectListComponent implements OnInit {

  results : ElevatedObject[];
  status : number;
  indicator;
  onInitError : ApiError;

  constructor(
    private objectService : ElevatedObjectService,
    private router : Router,
    private route : ActivatedRoute
  ){
    this.results = [];
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = STATUS_INDICATOR.LOADING;

    this.onInitError = null;

    this.objectService
      .search(this.route.snapshot.queryParamMap)
      .then(data => {
        this.results = data;
        (data.length == 0) ? this.status = STATUS_INDICATOR.EMPTY : this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }


}
