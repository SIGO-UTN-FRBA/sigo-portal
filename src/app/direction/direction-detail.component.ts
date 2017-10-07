import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  template:`
    <h1 i18n="@@direction.detail.title">
      Airport detail
    </h1>
    <p i18n="@@direction.detail.main_description">
      This section allows users to inspect a runway direction.
    </p>
    <hr/>

    <div class="container-fluid">
      <app-direction-general-view *ngIf="!edit_general" [(edit)]="edit_general" [airportId]="airportId" [runwayId]="runwayId" [directionId]="directionId"></app-direction-general-view>
      <app-direction-general-edit *ngIf="edit_general" [(edit)]="edit_general" [airportId]="airportId" [runwayId]="runwayId" [directionId]="directionId"></app-direction-general-edit>

      <br>
      
      <app-direction-geometry-view *ngIf="!edit_geometry" [(edit)]="edit_geometry" [airportId]="airportId" [runwayId]="runwayId" [directionId]="directionId"></app-direction-geometry-view>
      <app-direction-geometry-edit *ngIf="edit_geometry" [(edit)]="edit_geometry" [airportId]="airportId" [runwayId]="runwayId" [directionId]="directionId"></app-direction-geometry-edit>
      
    </div>
  `
})

export class DirectionDetailComponent implements OnInit{

  edit_general : boolean;
  edit_geometry : boolean;
  airportId : number;
  runwayId : number;
  directionId : number;

  constructor(
    private route : ActivatedRoute
  ){
    this.edit_general = false;
    this.edit_geometry = false;
  }

  ngOnInit(): void {
      this.airportId = this.route.parent.parent.parent.snapshot.params['airportId'];
      this.runwayId = this.route.parent.snapshot.params['runwayId'];
      this.directionId = this.route.snapshot.params['directionId'];
  }
}
