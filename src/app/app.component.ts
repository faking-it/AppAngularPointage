import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AppAngularPointage';

  emptyInput = '';

  constructor() {}

  options = {
    fixed: true,
    top: 50,
    bottom: 0
  }

  toolbarHeight: string = "height:" + this.options.top + "px;";
}
