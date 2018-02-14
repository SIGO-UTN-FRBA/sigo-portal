import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AnalysisCaseService} from "./analysis-case.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AnalysisObject} from "./analysisObject";
import {ElevatedObjectService} from "../object/object.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ApiError} from "../main/apiError";
import {ElevatedObjectType, ElevatedObjectTypeFactory} from '../object/objectType';
import {PlacedObjectCatalogService} from "../object/object-catalog.service";
import {AnalysisService} from "./analysis.service";
import {AirportService} from "../airport/airport.service";
import {OlComponent} from "../olmap/ol.component";
import Feature = ol.Feature;
import {AnalysisCase} from "./analysisCase";
import {UiError} from "../main/uiError";
import {BlockTemplateComponent} from "../commons/block-template.component";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {AnalysisObjectService} from "./analysis-object.service";
import {AnalysisWizardService} from "./analysis-wizard.service";
import {AuthService} from '../auth/auth.service';
import {AbstractAnalysisWizardComponent} from './analysis-wizard-abstract.component';

@Component({
  providers: [ OlComponent ],
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.object.title">Analysis: Define objects</ng-container>
      <small class="pull-right">
        <ng-container i18n="@@wizard.commons.stage">Stage</ng-container>
        1/4
      </small>
    </h1>
    <p i18n="@@analysis.wizard.object.main_description">
      This section allows users to define which objects are going to be analyzed.
    </p>

    <hr/>

    <div *ngIf="onInitError">
      <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
    </div>

    <div *ngIf="onSubmitError">
      <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
    </div>

    <block-ui [template]="blockTemplate" [delayStop]="500">
      <div class="panel panel-default" *ngIf="initObjectsStatus != null">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@analysis.wizard.object.section.objects.title">
            Objects
          </h3>
        </div>
        <div [ngSwitch]="initObjectsStatus" class="panel-body">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitObjectsError]"></app-error-indicator>
          </div>
          <ng-container *ngSwitchCase="indicator.ACTIVE">

            <form #caseForm
                  class="form-inline"
                  (ngSubmit)="onUpdate()"
            >
              <div class="form-group">
                <label for="inputSearchRadius"
                       i18n="@@analysis.wizard.object.section.objects.searchRadius"
                >
                  Search Radius
                </label>
                <div class="input-group">

                  <input type="number"
                         class="form-control"
                         name="inputSearchRadius"
                         [(ngModel)]="searchRadius"
                         required>
                  <div class="input-group-addon">[km]</div>
                </div>
              </div>
              <div class="checkbox">
                <label>
                  <input type="checkbox"
                         name="inputIncludeTerrain"
                         [(ngModel)]="includeTerrain"
                         i18n="@@analysis.wizard.object.section.objects.includeTerrain"
                  >
                  Include terrain
                </label>
              </div>
              <button type="submit"
                      [disabled]="caseForm.invalid"
                      *ngIf="allowEdit"
                      class="btn btn-default"
                      i18n="@commons.button.update"
              >
                Update
              </button>
            </form>
            <br>
            <ng-container [ngSwitch]="updateStatus">

              <div *ngSwitchCase="indicator.LOADING">
                <app-loading-indicator></app-loading-indicator>
              </div>
              <div *ngSwitchCase="indicator.ERROR">
                <app-error-indicator [errors]="[onUpdateError]"></app-error-indicator>
              </div>
              <div *ngSwitchCase="indicator.EMPTY">
                <app-empty-indicator entity="placed objects" type="included"></app-empty-indicator>
              </div>

              <div *ngSwitchCase="indicator.ACTIVE" class="table-responsive" style="max-height: 40em; overflow: auto;">

                <ng-container *ngIf="onIncludeError">
                  <app-error-indicator [errors]="[onIncludeError]"></app-error-indicator>
                </ng-container>

                <table class="table table-hover">
                  <tr>
                    <th>#</th>
                    <th i18n="@@analysis.wizard.object.section.objects.name">Name</th>
                    <th i18n="@@analysis.wizard.object.section.objects.type">Type</th>
                    <th i18n="@@analysis.wizard.object.section.objects.included">
                      Included (<input type="checkbox" *ngIf="allowEdit" [checked]="allChecked" (click)="checkAll($event)"/>)
                    </th>
                  </tr>
                  <tbody>
                  <tr *ngFor="let analysisObject of onlyPlacedObjects; index as i;">
                    <td>
                      <a (click)="locateObjectOnMap(analysisObject)" style="cursor: pointer">
                        <strong>{{i + 1}}</strong>
                      </a>
                    </td>
                    <td>
                      <a [routerLink]="['/objects', getTypeById(analysisObject.object.typeId).route, analysisObject.object.id]">
                        {{analysisObject.object.name}}
                      </a>
                    </td>
                    <td>
                      {{types[analysisObject.object.typeId].description}}
                    </td>
                    <td>
                      <input type="checkbox"
                             *ngIf="allowEdit"
                             [(ngModel)]="analysisObject.included"
                             (ngModelChange)="includeObject(analysisObject.id, $event)">
                      <p *ngIf="!allowEdit">{{analysisObject.included}}</p>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <br>
              </div>
            </ng-container>

            <br>

            <app-map #mapObjects
                     [rotate]="true"
                     [fullScreen]="true"
                     [scale]="true"
                     [layerSwitcher]="true"
                     [layers]="['airport', 'runway', 'objects', 'terrain']"
            >
            </app-map>
          </ng-container>
        </div>
      </div>

      <br>

      <nav *ngIf="allowEdit">
        <ul class="pager">
          <li class="next">
            <a (click)="onNext()" style="cursor: pointer">
              <ng-container i18n="@@commons.wizard.next">Next</ng-container>
              <span aria-hidden="true">&#9658;</span>
            </a>
          </li>
        </ul>
      </nav>
    </block-ui>
  `
})

export class AnalysisWizardObjectComponent extends AbstractAnalysisWizardComponent implements OnInit, AfterViewInit {

  @BlockUI() blockUI: NgBlockUI;
  blockTemplate = BlockTemplateComponent;
  initObjectsStatus: number;
  updateStatus:number;
  analysisCase:AnalysisCase;
  analysisObjects:AnalysisObject[];
  onInitObjectsError: ApiError;
  onUpdateError:ApiError;
  onIncludeError:ApiError;
  types:ElevatedObjectType[];
  airportFeature: Feature;
  private olmap: OlComponent;
  onlyPlacedObjects: AnalysisObject[];
  @ViewChildren('mapObjects') mapObjects: QueryList<ElementRef>;
  searchRadius:number;
  allChecked: boolean;
  includeTerrain: boolean;

  constructor(
    analysisService: AnalysisService,
    private caseService: AnalysisCaseService,
    private objectService: ElevatedObjectService,
    private objectCatalogService: PlacedObjectCatalogService,
    private airportService: AirportService,
    private analysisObjectService: AnalysisObjectService,
    wizardService: AnalysisWizardService,
    authService: AuthService,
    route: ActivatedRoute,
    router: Router
  ){
    super(analysisService, wizardService, authService, route, router);

    this.analysisObjects = [];
    this.types = [];
  }

  stageId(): number {
    return 1;
  }

  ngOnInit(): void {

    this.blockUI.stop();
    this.analysisId = this.route.snapshot.params['analysisId'];
    this.initObjectsStatus = null;
    this.onInitError = null;
    this.onInitObjectsError = null;
    this.updateStatus = null;
    this.onIncludeError = null;
    this.allowEdit = null;

    this.resolveAnalysis()
      .then(() => this.validateCurrentStage())
      .then(() => this.resolveEdition())
      .catch(error => Promise.reject(this.onInitError = error))
      .then(()=> this.initObjectsStatus = STATUS_INDICATOR.LOADING)
      .then(() => this.objectCatalogService.listTypeObject())
      .then(data => this.types = data)
      .then(()=> this.resolveAnalysisCase())
      .then(() => this.resolveObjects())
      .then(() => {
        this.initObjectsStatus = STATUS_INDICATOR.ACTIVE;
        this.updateStatus = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        if(!this.onInitError){
          this.onInitObjectsError = error;
          this.initObjectsStatus = STATUS_INDICATOR.ERROR;
        }
      });

  }

  private resolveAnalysisCase() : Promise<any> {
    return this.caseService
      .get(this.analysis.id)
      .then(data => {
        this.analysisCase = data;
        this.searchRadius = data.searchRadius * 100;
        this.includeTerrain = data.includeTerrain;
      })
  }

  private resolveDataObjects() : Promise<any> {
    return Promise.all(
      this.analysisObjects.map(a =>
          this.objectService
            .get(a.objectId, a.objectTypeId)
            .then(o => a.object = o)
        )
    );
  }

  private resolveFeatureObjects() : Promise<any> {

    let p1 = this.airportService
      .get(this.analysis.airportId)
      .then(data => this.analysis.airport=data);

    let p3 = this.airportService
      .getFeature(this.analysis.airportId)
      .then(data => this.airportFeature = data);

    let p2 = Promise.all(
      this.analysisObjects.map(a =>
        this.objectService
          .getFeature(a.object.id,a.objectTypeId)
          .then(f => a.object.feature = f)
      )
    );

    return Promise.all([p1,p2,p3]);
  }

  ngAfterViewInit(): void {
    this.mapObjects.changes.subscribe(item => {
      if(!(this.olmap = item.first))
        return;

      if(this.olmap.started)
        return;

      this.locateFeatures();

      this.olmap.started = true;
    });
  }

  private locateFeatures() {

    this.analysisObjects.forEach(
      a => this.olmap.addObject(a.object.feature)
    );

    this.olmap.addAirport(this.airportFeature,{center:true, zoom:13});
  }

  onUpdate(){

    this.updateStatus = STATUS_INDICATOR.LOADING;
    this.onUpdateError=null;
    this.analysisObjects = [];

    this.caseService
      .update(this.analysis.id, this.searchRadius / 100, this.includeTerrain)
      .then(data => this.analysisCase = data)
      .then(() => this.clearMapLayers())
      .then(() => this.resolveObjects())
      .then(()=> this.locateFeatures())
      .then(() => {
        if(this.analysisObjects.length > 0)
          this.updateStatus = STATUS_INDICATOR.ACTIVE;
        else
          this.updateStatus = STATUS_INDICATOR.EMPTY;
      })
      .catch(error => {
        this.onUpdateError = error;
        this.updateStatus = STATUS_INDICATOR.ERROR;
      })
  }

  private resolveObjects() : Promise<any> {

    return this.analysisObjectService
      .list(this.analysis.id)
      .then(data => this.analysisObjects = data)
      .then(() => this.resolveDataObjects())
      .then(() => this.resolveFeatureObjects())
      .then(() => this.filterObjectsToList())
  }

  private clearMapLayers() : OlComponent {
    return this.olmap
      .clearTerrainLayer()
      .clearObjectLayers()
      .clearAirportLayer()
      .clearRunwayLayer();
  }

  onNext() {

    this.onSubmitError = null;

    this.blockUI.start("Processing...");

    //1. verificar que existan objetos includos
    if(this.analysisObjects.length > 0 && !this.analysisObjects.some(o => o.included)){
      this.onSubmitError = new UiError("There is not object included into analysis case","Error");
      this.blockUI.stop();
      return;
    }

    //2. actualizar stage
    this.wizardService.next(this.analysisId)
      .then( () =>{
        this.blockUI.stop();
        return this.router.navigate([`/analysis/${this.analysisId}/stages/exception`])
      })
      .catch((error) => {
        this.onSubmitError = error;
        this.blockUI.stop();
      });
  }

  includeObject(analysisObjectId: number, $event: Event) {

    this.onIncludeError = null;

    let analysisObject = this.analysisObjects.filter(o => o.id == analysisObjectId)[0];

    this.updateObject(analysisObject)
      .then(()=> this.allChecked = this.isAllChecked());
  }

  private updateObject(analysisObject: AnalysisObject): Promise<any> {
    return this.analysisObjectService
      .update(this.analysisId, analysisObject.id, analysisObject.included)
      .catch((error) => this.onIncludeError = error);
  }

  private filterObjectsToList() {
    this.onlyPlacedObjects = this.analysisObjects.filter(a => a.objectTypeId != 3);
  }

  checkAll(ev) {
    this.onlyPlacedObjects
      .filter(p => p.included != ev.target.checked)
      .forEach( p => {
        p.included = ev.target.checked;
        this.updateObject(p);
      })
  }

  isAllChecked(): boolean {
    return this.onlyPlacedObjects.every(p => p.included);
  }

  locateObjectOnMap(analysisObject: AnalysisObject){

    let layer: string;
  //FIXME lo tendira q resolver olmap a partir de la feature
    switch (analysisObject.objectTypeId){
      case 0:
        layer = 'BuildingObject';
        break;
      case 1:
        layer = 'IndividualObject';
        break;
      case 2:
        layer = 'WiringObject';
        break;
      case 3:
        layer = 'Terrain';
        break;
      case 4:{
        layer = analysisObject.object.feature.get('class') + 'TrackSection'
      }
    }

    this.olmap.selectFeature(analysisObject.objectId, layer, {center:true, zoom: 15, info: true});
  }

  getTypeById(id: number): ElevatedObjectType {
    return ElevatedObjectTypeFactory.getTypeById(id);
  }
}
