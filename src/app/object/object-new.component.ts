import {Component} from "@angular/core";
import {Router} from '@angular/router';


@Component({
  template:`
    <h1 i18n="@@exception.new.title">
      New elevated object
    </h1>
    <p i18n="@@exception.new.main_description">
      This section allows users to select a kind of elevated object to be created.
    </p>
    <hr/>
    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-body">
          <form id="ngForm"
                #exceptionForm="ngForm"
                role="form"
                class="form container-fluid"
                (ngSubmit)="onSubmit()">
            <div class="form-group">
              <div class="col-sm-12">
                <div class="radio">
                  <label for="options">
                    <input type="radio"
                           name="options"
                           value="placedObject?type=0"
                           [(ngModel)]="selected"
                           required
                    />
                    <ng-container i18n="@@object.new.option.building">Building</ng-container>
                  </label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-sm-12">
                <div class="radio">
                  <label for="options">
                    <input type="radio"
                           name="options"
                           value="placedObject?type=1"
                           [(ngModel)]="selected"
                           required
                    />
                    <ng-container i18n="@@object.new.option.individual">Individual</ng-container>
                  </label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-sm-12">
                <div class="radio">
                  <label for="options">
                    <input type="radio"
                           name="options"
                           value="placedObject?type=2"
                           [(ngModel)]="selected"
                           required
                    />
                    <ng-container i18n="@@object.new.option.overheadwired">Overhead wire</ng-container>
                  </label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-sm-12">
                <div class="radio">
                  <label for="options">
                    <input type="radio"
                           name="options"
                           value="track"
                           [(ngModel)]="selected"
                           required
                    />
                    <ng-container i18n="@@object.new.option.trackSection">Track section</ng-container>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <br>
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
            (click)="exceptionForm.ngSubmit.emit()"
            [disabled]="!this.selected"
            class="btn btn-success"
            i18n="@@commons.button.create">
            Create
          </button>
        </div>
      </div>
    </div>
  `
})

export class ObjectNewComponent {

  selected:string;

  constructor(
    private router: Router
  ){
    this.selected=null;
  }

  onSubmit(){
    return this.router.navigateByUrl(`/objects/new/${this.selected}`)
  }

  onCancel(){
    return this.router.navigateByUrl(`/objects/search`)
  }

}
