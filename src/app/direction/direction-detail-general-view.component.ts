import {Component, Input, OnInit} from "@angular/core";
import {DirectionService} from "./direction.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayDirection} from "./runwayDirection";

@Component({
  selector: 'app-direction-general-view',
  template: `
    {{airportId}},{{runwayId}},{{directionId}}
  `
})

export class DirectionDetailGeneralViewComponent implements OnInit {
  @Input() airportId : number;
  @Input() runwayId : number;
  @Input() directionId : number;
  private indicator;
  status : number;
  direction : RunwayDirection;

  constructor(
    private directionService : DirectionService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = this.indicator.LOADING;

    this.directionService
      .get(this.airportId, this.runwayId, this.directionId)
      .then(data => {
        this.direction = data;
        this.status = this.indicator.ACTIVE;
      })
  }
}
