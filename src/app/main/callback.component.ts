import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-callback',
  template: `
    <div class="loading center-block">
      <img src="assets/images/loading.gif" alt="loading">
    </div>
  `
})

export class CallbackComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}
