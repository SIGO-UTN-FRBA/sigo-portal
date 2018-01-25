import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  template: `
    <breadcrumb></breadcrumb>

    <h1 i18n="@@object.detail.title">
      Object details
    </h1>
    <p i18n="@@object.detail.main_description">
      This section allows to inspect an object.
    </p>
    <hr/>

    <div class="container-fluid">
      <app-object-general-view *ngIf="!edit_general" 
                               [(edit)]="edit_general" 
                               [placedObjectId]="objectId"
                               [objectTypeId]="objectType"
      >
      </app-object-general-view>
      
      <app-object-general-edit *ngIf="edit_general" 
                               [(edit)]="edit_general" 
                               [placedObjectId]="objectId"
                               [objectTypeId]="objectType"
      >
      </app-object-general-edit>

      <br>

      <app-object-geometry-view *ngIf="!edit_geometry" [(edit)]="edit_geometry" [placedObjectId]="objectId" [placedObjectType]="objectType"></app-object-geometry-view>
      <app-object-geometry-edit *ngIf="edit_geometry" [(edit)]="edit_geometry" [placedObjectId]="objectId" [placedObjectType]="objectType"></app-object-geometry-edit>
      
    </div>
  `
})

export class PlacedObjectDetailComponent {

  edit_general : boolean;
  edit_geometry : boolean;
  objectId: number;
  objectType: number;

  constructor(
    private route: ActivatedRoute
  ){
    this.edit_general = false;
    this.edit_geometry = false;
  }

  ngOnInit() : void {
    this.objectId = +this.route.snapshot.params['objectId'];
    this.objectType = +this.route.snapshot.params['objectType'];
  }

}
