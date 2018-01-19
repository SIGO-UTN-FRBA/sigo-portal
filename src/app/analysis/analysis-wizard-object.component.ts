import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {AnalysisCaseService} from "./analysis-case.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AnalysisObject} from "./analysisObject";
import {ElevatedObjectService} from "../object/object.service";
import {PlacedObject} from "../object/placedObject";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ApiError} from "../main/apiError";
import {PlacedObjectType} from "../object/objectType";
import {PlacedObjectCatalogService} from "../object/object-catalog.service";
import {AnalysisService} from "./analysis.service";
import {Analysis} from "./analysis";
import {AirportService} from "../airport/airport.service";
import {OlComponent} from "../olmap/ol.component";
import Map = ol.Map;
import Feature = ol.Feature;
import {AnalysisCase} from "./analysisCase";
import {UiError} from "../main/uiError";
import {AppError} from "../main/ierror";
import {BlockTemplateComponent} from "../commons/block-template.component";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {AnalysisObjectService} from "./analysis-object.service";
import {AnalysisWizardService} from "./analysis-wizard.service";

@Component({
  providers: [ OlComponent ],
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.object.title">Analysis: Define objects </ng-container>
      <small class="pull-right">Stage 1/4</small>
    </h1>
    <p i18n="@@wizard.object.main_description">
      This section allows users to define which objects are going to be analyzed.
    </p>
    
    <hr/>

    <div *ngIf="onSubmitError">
      <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
    </div>
    
    <block-ui [template]="blockTemplate" [delayStop]="500">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@analysis.wizard.object.section.objects.title">
            Objects
          </h3>
        </div>
        <div [ngSwitch]="initStatus" class="panel-body" style="max-height: 40em; overflow: auto;">
          <div *ngSwitchCase="indicator.LOADING" >
              <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
              <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
          </div>
          <ng-container *ngSwitchCase="indicator.ACTIVE">
  
            <form #caseForm 
                  class="form-inline"
                  (ngSubmit)="onUpdateRadius()"
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
              <button type="submit"
                      [disabled]="caseForm.invalid"
                      class="btn btn-default"
                      i18n="@commons.button.update"
              >
                Update
              </button>
            </form>
            <br>
            <ng-container [ngSwitch]="updateStatus">
  
              <div *ngSwitchCase="indicator.LOADING" >
                <app-loading-indicator></app-loading-indicator>
              </div>
              <div *ngSwitchCase="indicator.ERROR" >
                <app-error-indicator [errors]="[onUpdateError]"></app-error-indicator>
              </div>
              <div *ngSwitchCase="indicator.EMPTY" >
                <app-empty-indicator entity="placed objects" type="included"></app-empty-indicator>
              </div>
              
              <div *ngSwitchCase="indicator.ACTIVE" class="table-responsive">
                
                <ng-container *ngIf="onIncludeError">
                  <app-error-indicator [errors]="[onIncludeError]"></app-error-indicator>
                </ng-container>
                
                <table class="table table-hover">
                  <tr>
                    <th>#</th>
                    <th i18n="@@analysis.wizard.object.section.objects.name">Name</th>
                    <th i18n="@@analysis.wizard.object.section.objects.type">Type</th>
                    <th i18n="@@analysis.wizard.object.section.objects.included">Included</th>
                  </tr>
                  <tbody>
                    <tr *ngFor="let analysisObject of onlyPlacedObjects; index as i;">
                      <td><strong>{{i+1}}</strong></td>
                      <td>
                        <a [routerLink]="['/objects', analysisObject.object.typeId, analysisObject.object.id]">
                          {{analysisObject.object.name}}
                        </a>
                      </td>
                      <td>
                        {{types[analysisObject.object.typeId].description}}
                      </td>
                      <td>
                        <input type="checkbox" [(ngModel)]="analysisObject.included" (ngModelChange)="includeObject(analysisObject.id, $event)">
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br>
              </div>
            </ng-container>
            <app-map #mapObjects
                     (map)="map"
                     [rotate]="true"
                     [fullScreen]="true"
                     [scale]="true"
                     [layers]="['airport', 'runway', 'individual', 'building', 'wire', 'terrain']"
            >
            </app-map>
          </ng-container>
        </div>
      </div>
     
      <br>
      
      <nav>
        <ul class="pager">
          <li class="next">
            <a (click)="onNext()" style="cursor: pointer">
              <ng-container i18n="@@commons.wizard.next">Next </ng-container>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </li>
        </ul>
      </nav>
    </block-ui>
  `
})

export class AnalysisWizardObjectComponent implements OnInit, AfterViewInit {

  @BlockUI() blockUI: NgBlockUI;
  blockTemplate = BlockTemplateComponent;
  initStatus:number;
  updateStatus:number;
  indicator;
  analysis:Analysis;
  analysisId:number;
  analysisCase:AnalysisCase;
  analysisObjects:AnalysisObject[];
  onInitError:ApiError;
  onUpdateError:ApiError;
  onSubmitError:AppError;
  onIncludeError:ApiError;
  types:PlacedObjectType[];
  airportFeature: Feature;
  private olmap: OlComponent;
  onlyPlacedObjects: AnalysisObject[];
  @ViewChild('mapObjects') set content(content: OlComponent) {
    this.olmap = content;
  }
  map:Map;
  searchRadius:number;

  constructor(
    private analysisService: AnalysisService,
    private caseService: AnalysisCaseService,
    private objectService: ElevatedObjectService,
    private objectCatalogService: PlacedObjectCatalogService,
    private airportService: AirportService,
    private analysisObjectService: AnalysisObjectService,
    private wizardService: AnalysisWizardService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.analysisObjects = [];
    this.indicator = STATUS_INDICATOR;
    this.types = [];
  }

  ngOnInit(): void {

    this.blockUI.stop();
    this.analysisId = this.route.snapshot.params['analysisId'];
    this.initStatus = STATUS_INDICATOR.LOADING;
    this.onInitError = null;
    this.updateStatus = null;
    this.onIncludeError = null;

    let p1 = this.objectCatalogService
      .listTypeObject()
      .then(data => this.types = data)
      .catch(error => Promise.reject(error));

    let p2 = this.resolveAnalysis()
      .then(() => this.resolveAnalysisCase())
      .then(() => this.resolveObjects())
      .catch(error => Promise.reject(error));

    Promise.all([p1, p2])
      .then(() => {
        this.initStatus = STATUS_INDICATOR.ACTIVE;
        this.updateStatus = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.initStatus = STATUS_INDICATOR.ERROR;
      });
  }

  private resolveAnalysis() : Promise<any> {
      return this.analysisService
        .get(this.analysisId)
        .then(data => this.analysis = data)
  }

  private resolveAnalysisCase() : Promise<any> {
    return this.caseService
      .get(this.analysis.id)
      .then(data => {
        this.analysisCase = data;
        this.searchRadius = data.searchRadius * 100;
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
    setTimeout(()=> {this.locateFeatures()},3500);
  }

  private locateFeatures() {

    this.analysisObjects.forEach(
      a => this.olmap.addObject(a.object.feature)
    );

    this.olmap.addAirport(this.airportFeature,{center:true, zoom:13});
  }

  locateObject(placedObject: PlacedObject) {

  }

  onUpdateRadius(){

    this.updateStatus = STATUS_INDICATOR.LOADING;
    this.onUpdateError=null;
    this.analysisObjects = [];

    this.caseService
      .update(this.analysis.id, this.searchRadius / 100)
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

    this.analysisObjectService
      .update(this.analysisId, analysisObjectId, analysisObject.included)
      .catch((error) => this.onIncludeError = error);
  }

  private filterObjectsToList() {
    this.onlyPlacedObjects = this.analysisObjects.filter(a => a.objectTypeId != 3);
  }
}
