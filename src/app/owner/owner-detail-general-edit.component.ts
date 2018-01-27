import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ObjectOwner} from "./objectOwner";
import {ObjectOwnerService} from "./owner.service";

@Component({
  selector: 'app-objectOwner-general-edit',
  template: `
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@airport.detail.section.general.title">
            General
          </h3>
        </div>
        
        <div class="panel-body" [ngSwitch]="status">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
            <app-error-indicator [errors]="onInitError"></app-error-indicator>
          </div>
          <form #objectOwnerForm="ngForm"
                *ngSwitchCase="indicator.ACTIVE"
                role="form" 
                class="form container-fluid" 
                (ngSubmit)="onSubmit()">

            <app-error-indicator [errors]="onSubmitError" *ngIf="onSubmitError"></app-error-indicator>
            
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label 
                  for="inputName" 
                  class="control-label" 
                  i18n="@@objectOwner.detail.section.general.inputName">
                  Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputName"
                  [(ngModel)]="objectOwner.name"
                  required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label 
                  for="inputAddress" 
                  class="control-label" 
                  i18n="@@objectOwner.detail.section.general.inputAddress">
                  Address
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputAddress"
                  [ngModel]="objectOwner.address"
                  disabled
                  required>
              </div>
              <div class="col-md-6 col-sm-12">
                <label 
                  for="inputEmail" 
                  class="control-label" 
                  i18n="@@objectOwner.detail.section.general.inputEmail">
                  E-mail
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputEmail"
                  [(ngModel)]="objectOwner.email"
                  required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputPhone1"
                  class="control-label"
                  i18n="@@objectOwner.detail.section.general.inputPhone1">
                  Phone1
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputPhone1"
                  [ngModel]="objectOwner.phone1"
                  disabled
                  required>
              </div>
              <div class="col-md-6 col-sm-12">
                <label
                  for="inputPhone2"
                  class="control-label"
                  i18n="@@objectOwner.detail.section.general.inputPhone2">
                  Phone2
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputPhone2"
                  [(ngModel)]="objectOwner.phone2"
                  required>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="pull-right">
                <button
                  (click)="onCancel()"
                  type="button" 
                  class="btn btn-default" 
                  i18n="@@commons.button.cancel">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  [disabled]="objectOwnerForm.invalid"
                  class="btn btn-success" 
                  i18n="@@commons.button.save">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  `
})


export class ObjectOwnerDetailGeneralEditComponent implements OnInit{
  status: number;
  objectOwner : ObjectOwner;
  @Input() objectOwnerId : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  onInitError : ApiError;
  onSubmitError : ApiError;
  indicator;

  constructor(
    private objectOwnerService : ObjectOwnerService
  ){
    this.objectOwner = new ObjectOwner();
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.objectOwnerService
      .get(this.objectOwnerId)
      .then( data => {
        this.objectOwner = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error =>{
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit(){

    this.onSubmitError = null;

    this.objectOwnerService
      .update(this.objectOwner)
      .then( () => this.disallowEdition() )
      .catch(error => this.onSubmitError = error);
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
