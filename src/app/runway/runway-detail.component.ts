import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: `
    <breadcrumb></breadcrumb>
    
    <h1 i18n="@@runway.detail.title">
      Runway detail
      <small></small>
    </h1>
    <p i18n="@@runway.detail.main_description">
      This section allows users to inspect a runway.
    </p>
    <hr/>

    <div class="container-fluid">
      <app-runway-general-view *ngIf="!edit_general" [(edit)]="edit_general" [airportId]="airportId" [runwayId]="runwayId"></app-runway-general-view>
      <app-runway-general-edit *ngIf="edit_general" [(edit)]="edit_general" [airportId]="airportId" [runwayId]="runwayId"></app-runway-general-edit>

      <br>

      <app-runway-geometry-view *ngIf="!edit_geometry" [(edit)]="edit_geometry" [airportId]="airportId" [runwayId]="runwayId"></app-runway-geometry-view>
      <app-runway-geometry-edit *ngIf="edit_geometry" [(edit)]="edit_geometry" [airportId]="airportId" [runwayId]="runwayId"></app-runway-geometry-edit>

      <br>

      <app-runway-children [airportId]="airportId" [runwayId]="runwayId"></app-runway-children>

    </div>
  `
})

export class RunwayDetailComponent implements OnInit{

  runwayId: number;
  airportId: number;
  edit_general: boolean;
  edit_geometry: boolean;

  constructor(
    private route: ActivatedRoute,
  ){
    this.edit_general = false;
    this.edit_geometry = false;
  }

  ngOnInit(): void {

    this.airportId = this.route.parent.snapshot.params['airportId'];
    this.runwayId = this.route.snapshot.params['runwayId'];
  }
}
