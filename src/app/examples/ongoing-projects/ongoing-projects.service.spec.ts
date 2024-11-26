import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OngoingProjectsData, OngoingProjectsService, Project } from './ongoing-projects.service';

describe('OngoingProjectsService', () => {
  let service: OngoingProjectsService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        OngoingProjectsService,
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OngoingProjectsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch projects from API', () => {
    const mockProjects: OngoingProjectsData = {
      projects: [
        {
          name: 'Alipay',
          description: 'Lorem aliquet est risus pretium, cursus.',
          details: ['Ultrices at viverra', '7 days ago'],
          date: '7 days ago',
          icon: 'https://www.example.com/alipay-icon.png'
        },
        {
          name: 'Angular',
          description: 'Sed facilisis eget elementum quis cum velit massa.',
          details: ['Quis rhoncus', '3 years ago'],
          date: '3 years ago',
          icon: 'https://www.example.com/angular-icon.png'
        }
      ]
    };

    service.fetchProjects();
    const req = httpTestingController.expectOne('https://api.example.com/ongoing-projects');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
    expect(service.ongoingProjects().projects).toEqual(mockProjects.projects);
    httpTestingController.verify();
  });

  it('should updateProject (not implemented)', () => {
    // Since updateProject is not implemented, this test is a placeholder.
    // You should implement updateProject logic and add tests for it.
    const updatedProject: Project = {
      name: 'Alipay',
      description: 'Lorem aliquet est risus pretium, cursus.',
      details: ['Ultrices at viverra', '7 days ago'],
      date: '7 days ago',
      icon: 'https://www.example.com/alipay-icon.png'
    };
    service.updateProject(updatedProject);
    // Add assertions to verify the update logic is working as expected
  });
});
