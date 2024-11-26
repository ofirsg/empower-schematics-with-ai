import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock } from 'ts-mocks';
import { OngoingProjectsComponent } from './ongoing-projects.component';
import { OngoingProjectsService } from './ongoing-projects.service';

describe('OngoingProjectsComponent', () => {
  let component: OngoingProjectsComponent;
  let fixture: ComponentFixture<OngoingProjectsComponent>;
  let ongoingProjectsServiceMock: Mock<OngoingProjectsService>;

  beforeEach(async () => {
    ongoingProjectsServiceMock = new Mock<OngoingProjectsService>({
      fetchProjects: () => {},
    })

    await TestBed.configureTestingModule({
      declarations: [OngoingProjectsComponent],
      providers: [
        { provide: OngoingProjectsService, useFactory: () => ongoingProjectsServiceMock.Object },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch projects on init', () => {
    component.ngOnInit();
    expect(ongoingProjectsServiceMock.Object.fetchProjects).toHaveBeenCalled();
  });

  it('should display the correct number of projects', () => {
    ongoingProjectsServiceMock.extend({
      ongoingProjects: signal({ projects: [
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
        ]})
    })

    component.ngOnInit();
    fixture.detectChanges();

    const headerElement = fixture.nativeElement.querySelector('.ongoing-projects-header');
    expect(headerElement.textContent.trim()).toContain('2 Ongoing Projects');
  });

  it('should display project details correctly', () => {
    ongoingProjectsServiceMock.extend({
      ongoingProjects: signal({ projects: [
          {
            name: 'Alipay',
            description: 'Lorem aliquet est risus pretium, cursus.',
            details: ['Ultrices at viverra', '7 days ago'],
            date: '7 days ago',
            icon: 'https://www.example.com/alipay-icon.png'
          }
        ]})
    })

    component.ngOnInit();
    fixture.detectChanges();

    const projectCard = fixture.nativeElement.querySelector('.project-card');
    expect(projectCard.querySelector('.project-name').textContent.trim()).toBe('Alipay');
    expect(projectCard.querySelector('.project-description').textContent.trim()).toBe('Lorem aliquet est risus pretium, cursus.');
    expect(projectCard.querySelector('.project-detail').textContent.trim()).toBe('Ultrices at viverra');
    expect(projectCard.querySelector('.project-date').textContent.trim()).toBe('7 days ago');
  });
});
