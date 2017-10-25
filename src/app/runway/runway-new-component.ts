import {Component, OnInit} from "@angular/core";
import {Runway} from "./runway";
import {RunwayService} from "./runway.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RunwayCatalogService} from "./runway-catalog.service";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {EnumItem} from "../commons/enumItem";

@Component({
  template: `
    <h1 i18n="@@runway.new.title">
      New runway
    </h1>
    <p i18n="@@runway.new.main_description">
      This section allows users to create a runway.
    </p>
    <hr/>

    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@runway.detail.section.general.title">
            General
          </h3>
        </div>
        <div class="panel-body" [ngSwitch]="status">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
            <app-error-indicator [error]="onInitError"></app-error-indicator>
          </div>
          <div *ngSwitchCase="indicator.ACTIVE" class="container-fluid">
            <form #generalForm="ngForm"
                  role="form"
                  class="form"
                  (ngSubmit)="onSubmit()">

              <app-error-indicator [error]="onSubmitError" *ngIf="onSubmitError"></app-error-indicator>
              
              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label
                    for="inputName"
                    class="control-label"
                    i18n="@@runway.detail.section.general.inputName">
                    Name
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    name="inputName"
                    [ngModel]="runway.name"
                    readonly>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 col-sm-12 form-group">
                  <label
                    for="inputWidth"
                    class="control-label"
                    i18n="@@runway.detail.section.general.inputWidth">
                    Width
                  </label>
                  <div class="input-group">
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      name="inputWidth"
                      [(ngModel)]="runway.width"
                      class="form-control"
                      placeholder="0000.0"
                      required>
                    <div class="input-group-addon">[m]</div>
                  </div>
                </div>
                <div class="col-md-6 col-sm-12 form-group">
                  <label
                    for="inputLength"
                    class="control-label"
                    i18n="@@runway.detail.section.general.inputLength">
                    Length
                  </label>
                  <div class="input-group">
                    <input
                      type="number"
                      min="1"
                      step="0.1"
                      name="inputLength"
                      class="form-control"
                      [(ngModel)]="runway.length"
                      placeholder="0000.0"
                      required>
                    <div class="input-group-addon">[m]</div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label
                    for="inputSurface"
                    class="control-label"
                    i18n="@@ruwnay.detail.section.general.inputSurface">
                    Surface
                  </label>
                  <select
                    name="inputSurface"
                    [(ngModel)]="runway.surfaceId"
                    class="form-control"
                    required>
                    <option *ngFor="let surface of surfaces" [value]="surface.id">
                      {{surface.name}} - {{surface.description}}
                    </option>
                  </select>
                </div>
              </div>
            </form>
            <br>
            <hr>
            <div class="row">
              <div class="pull-right">
                <button
                  type="button"
                  (click)="onCancel()"
                  class="btn btn-default"
                  i18n="@@commons.button.cancel">
                  Cancel
                </button>
                <button
                  type="button"
                  (click)="generalForm.ngSubmit.emit()"
                  [disabled]="generalForm.form.invalid"
                  class="btn btn-success"
                  i18n="@@commons.button.create">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class RunwayNewComponent implements OnInit{

  runway : Runway;
  surfaces : EnumItem[];
  onSubmitError: ApiError;
  onInitError: ApiError;
  status: number;
  indicator;

  constructor(
    private router : Router,
    private route : ActivatedRoute,
    private runwayService : RunwayService,
    private catalogService : RunwayCatalogService
  ){
    this.runway = new Runway();
    this.surfaces = [];
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.runway.airportId = +this.route.parent.snapshot.params['airportId'];

    this.runway.name = "RNW XX/XX";

    this.catalogService
      .listSurfaces()
      .then(data => {
        this.surfaces = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch( error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  onSubmit(){

    this.onSubmitError = null;

    this.runwayService.save(this.runway.airportId, this.runway)
      .then(data => this.router.navigate([`/airports/${this.runway.airportId}/runways/${data.id}/detail`]))
      .catch(error => this.onSubmitError = error);
  }

  onCancel(){
    this.router.navigate([`/airports/${this.runway.airportId}/detail`])
  }
}
