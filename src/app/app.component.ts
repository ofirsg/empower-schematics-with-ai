import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
// import { OngoingProjectsComponent } from './examples/ongoing-projects/ongoing-projects.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    // OngoingProjectsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
