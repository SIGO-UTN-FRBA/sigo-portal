import {Component, OnInit} from "@angular/core";
import {AnalysisObjectService} from "./analysis-object.service";
import {ActivatedRoute} from "@angular/router";
import {AnalysisObject} from "./analysisObject";
import {PlacedObjectService} from "../object/object.service";
import {PlacedObject} from "../object/object";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ApiError} from "../main/apiError";
import {PlacedObjectType} from "../object/objectType";
import {PlacedObjectCatalogService} from "../object/object-catalog.service";
import {AnalysisService} from "./analysis.service";

@Component({
  template:`
    <h1 i18n="@@analysis.wizard.object.title">
      Analysis: Define objects <small>Stage 1/4</small>
    </h1>
    <p i18n="@@wizard.object.main_description">
      This section allows users to define which objects are going to be analyzed.
    </p>
    <hr/>
    
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title" i18n="@@analysis.wizard.object.section.objects.title">
          Objects
        </h3>
      </div>
      <div [ngSwitch]="status" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING" >
            <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE">
          <table class="table table-hover">
            <thead>
              <th>Name</th>
              <th>Type</th>
              <th>Actions</th>
            </thead>
            <tbody>
              <tr *ngFor="let placedObject of placedObjects">
                <td>{{placedObject.name}}</td>
                <td>{{types[placedObject.typeId].description}}</td>
                <td>
                  <button class="btn btn-default btn-xs" type="button">
                    <span class="glyphicon glyphicon-remove"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})

export class AnalysisWizardObjectComponent implements OnInit {

  status:number;
  indicator;
  analysisObjects:AnalysisObject[];
  placedObjects:PlacedObject[];
  onInitError:ApiError;
  types:PlacedObjectType[];

  constructor(
    private analysisService: AnalysisService,
    private analysisObjectService : AnalysisObjectService,
    private objectService:PlacedObjectService,
    private objectCatalogService: PlacedObjectCatalogService,
    private route: ActivatedRoute
  ){
    this.placedObjects = [];
    this.analysisObjects = [];
    this.indicator = STATUS_INDICATOR;
    this.types = [];
  }

  ngOnInit(): void {

    let analysisId : number = this.route.snapshot.params['analysisId'];
    this.status = STATUS_INDICATOR.LOADING;
    this.onInitError = null;

    let p1 = this.objectCatalogService
      .listTypeObject()
      .then(data => this.types = data)
      .catch(error => Promise.reject(error));

    let p2 = this.analysisService
      .get(analysisId)
      .then(data =>  this.analysisObjectService.getList(data.caseId))
      .then(data => this.analysisObjects = data)
      .then(data => Promise.all(data.map(a => this.objectService.get(a.objectId).then(o => this.placedObjects.push(o)))))
      .catch(error => Promise.reject(error));

    Promise.all([p1, p2])
      .then(()=>this.status = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

}
