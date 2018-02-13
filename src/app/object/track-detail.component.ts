import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: `
    <breadcrumb></breadcrumb>
    <h1 i18n="@@track.detail.title">
      Track section details
    </h1>
    <p i18n="@@track.detail.main_description">
      This section allows to inspect a track section.
    </p>
    
    <hr/>

    <div class="container-fluid">
      <app-track-general-view *ngIf="!edit_general"
                               [(edit)]="edit_general"
                               [trackId]="objectId"
      >
      </app-track-general-view>

      <app-track-general-edit *ngIf="edit_general"
                               [(edit)]="edit_general"
                               [trackId]="objectId"
      >
      </app-track-general-edit>

      <br>

      <app-object-geometry-view *ngIf="!edit_geometry" 
                                [(edit)]="edit_geometry" 
                                [objectId]="objectId"
                                [objectType]="4"
      >
      </app-object-geometry-view>
      
      <app-object-geometry-edit *ngIf="edit_geometry" 
                                [(edit)]="edit_geometry" 
                                [objectId]="objectId"
                                [objectType]="4"
      >
      </app-object-geometry-edit>

    </div>
  `
})

export class TrackDetailComponent implements OnInit {
  edit_general : boolean;
  edit_geometry : boolean;
  objectId: number;

  constructor(
    private route: ActivatedRoute
  ){
    this.edit_general = false;
    this.edit_geometry = false;
  }

  ngOnInit() : void {
    this.objectId = +this.route.snapshot.params['objectId'];
  }
}
