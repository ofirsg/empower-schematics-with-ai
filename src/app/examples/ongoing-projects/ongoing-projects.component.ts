import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OngoingProjectsData, OngoingProjectsService } from './ongoing-projects.service';

@Component({
  selector: 'app-ongoing-projects',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './ongoing-projects.component.html',
  styleUrls: ['./ongoing-projects.component.scss']
})
export class OngoingProjectsComponent implements OnInit {
  ongoingProjects: Signal<OngoingProjectsData>;

  constructor(private ongoingProjectsService: OngoingProjectsService) {
    this.ongoingProjects = this.ongoingProjectsService.ongoingProjects;
  }

  ngOnInit(): void {
    // Fetch projects when the component initializes
    // this.ongoingProjectsService.fetchProjects();
  }
}
