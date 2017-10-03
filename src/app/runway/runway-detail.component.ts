import {Component, OnInit} from "@angular/core";
import {Runway} from "./runway";
import {RunwayService} from "./runway.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  template:`
    <h1>Runway detail
      <small></small>
    </h1>
    <p>This section allows users to inspect a runway.</p>
    <hr/>

    <div class="container-fluid">
      <runway-general-view *ngIf="!edit_general" [(edit)]="edit_general" [airportId]="airportId" [runwayId]="runwayId"></runway-general-view>
      <runway-general-edit *ngIf="edit_general" [(edit)]="edit_general" [airportId]="airportId" [runwayId]="runwayId"></runway-general-edit>

      <br>

      <runway-geometry-view *ngIf="!edit_geometry" [(edit)]="edit_geometry" [airportId]="airportId" [runwayId]="runwayId"></runway-geometry-view>
      <runway-geometry-edit *ngIf="edit_geometry" [(edit)]="edit_geometry" [airportId]="airportId" [runwayId]="runwayId"></runway-geometry-edit>

      <br>

      <runway-children [airportId]="airportId" [runwayId]="runwayId"></runway-children>
      
    </div>
  `
})

export class RunwayDetailComponent implements OnInit{

  runwayId: number;
  airportId: number;
  edit_general : boolean;
  edit_geometry : boolean;

  constructor(
    private route : ActivatedRoute,
  ){
    this.edit_general = false;
    this.edit_geometry = false;
  }

  ngOnInit(): void {

    this.airportId = this.route.snapshot.params['airportId'];
    this.runwayId = this.route.snapshot.params['runwayId'];
  }
}
