import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ApiError} from "../main/apiError";
import {Router} from "@angular/router";
import {ObjectOwner} from "./objectOwner";
import {ObjectOwnerService} from "./owner.service";

@Component({
  selector: 'app-objectOwner-general-view',
  template:`
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@objectOwner.detail.section.general.title">
            General
          </h3>
          <div class="col-md-6">
            <div class="pull-right">
              <div class="btn-group">
                <button
                  (click)="delete();"
                  class="btn btn-default"
                  i18n="@@commons.button.delete">
                  Delete
                </button>
              </div>
              <div class="btn-group">
                <button
                  (click)="allowEdition();"
                  class="btn btn-default"
                  i18n="@@commons.button.edit">
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      
      <div [ngSwitch]="status" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputNameFir" class="control-label" i18n="@@objectOwnerId.detail.section.general.inputNameFir">
                Name
              </label>
              <p class="form-control-static">{{objectOwner.name}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label for="inputCodeFir" class="control-label" i18n="@@objectOwnerId.detail.section.general.inputCodeFir">
                Address
              </label>
              <p class="form-control-static">{{objectOwner.address}}</p>
            </div>
            <div class="col-md-6 col-sm-12">
              <label for="inputCodeIATA" class="control-label" i18n="@@objectOwnerId.detail.section.general.inputCodeIATA">
                eMail
              </label>
              <p class="form-control-static">{{objectOwner.email}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label for="inputCodeFir" class="control-label" i18n="@@objectOwnerId.detail.section.general.inputCodeFir">
                Phone1
              </label>
              <p class="form-control-static">{{objectOwner.phone1}}</p>
            </div>
            <div class="col-md-6 col-sm-12">
              <label for="inputCodeIATA" class="control-label" i18n="@@objectOwnerId.detail.section.general.inputCodeIATA">
                Phone2
              </label>
              <p class="form-control-static">{{objectOwner.phone2}}</p>
            </div>
          </div>          
        </div>
      </div>
    </div>
  `
})

export class objectOwnerDetailGeneralViewComponent implements OnInit {

  objectOwner : ObjectOwner;
  @Input() objectOwnerId : number;
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  onInitError : ApiError;

  constructor(
    private objectOwnerService : ObjectOwnerService,
    private router : Router
  ){
    this.objectOwner = new ObjectOwner();
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit() : void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.objectOwnerService
      .get(this.objectOwnerId)
      .then(data => {
        this.objectOwner = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  delete() {
    this.objectOwnerService
      .delete(this.objectOwnerId)
      .then(()=> this.router.navigate(['/objects']))
      .catch( error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }
}
