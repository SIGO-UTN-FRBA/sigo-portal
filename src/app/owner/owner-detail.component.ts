import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";


@Component({
  template: `
    <breadcrumb></breadcrumb>
    
    <h1 i18n="@@objectOwnerId.detail.title">
      Owner detail
    </h1>
    <p i18n="@@objectOwnerId.detail.main_description">
      This section allows users to inspect an owner.
    </p>
    <hr/>

    <div class="container-fluid">
      <app-objectOwner-general-view *ngIf="!edit_general" [(edit)]="edit_general" [objectOwnerId]="objectOwnerId"></app-objectOwner-general-view>
      <app-objectOwner-general-edit *ngIf="edit_general" [(edit)]="edit_general" [objectOwnerId]="objectOwnerId"></app-objectOwner-general-edit>
    </div>
  `
})


export class ObjectOwnerDetailComponent implements OnInit{

  edit_general : boolean;
  objectOwnerId: number;

  constructor(
    private route: ActivatedRoute
  ){
    this.edit_general = false;
  }

  ngOnInit() : void {
    this.objectOwnerId = this.route.snapshot.params['objectOwnerId'];
  }

}
