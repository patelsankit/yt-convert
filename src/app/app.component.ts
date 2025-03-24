import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConverterComponent } from './converter/converter.component';

@Component({
  selector: 'app-root',
  // Import both RouterOutlet and ConverterComponent (standalone)
  imports: [RouterOutlet, ConverterComponent],
  // Here we're using an inline template for demonstration,
  // you can also use templateUrl and update your HTML file accordingly.
  template: `
    <div class="app-container">
      <h1>{{ title }}</h1>
      <!-- Include the converter component -->
      <app-converter></app-converter>
      <!-- Router outlet for additional routed views -->
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'yt-convert-angular';
}
