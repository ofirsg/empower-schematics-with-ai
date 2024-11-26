import {Injectable, WritableSignal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

export interface Project {
  name: string;
  description: string;
  details: string[];
  date: string;
  icon: string;
}

export interface OngoingProjectsData {
  projects: Project[];
}

@Injectable({
  providedIn: 'root'
})
export class OngoingProjectsService {

  private readonly apiUrl = 'https://api.example.com/ongoing-projects'; // Replace with your actual API URL

  ongoingProjects: WritableSignal<OngoingProjectsData> = signal({
    projects: []
  });

  constructor(private http: HttpClient) {
    // this.fetchProjects();
    this.ongoingProjects.set({ projects: this.mockProjects });
  }

  fetchProjects(): void {
    this.http.get<OngoingProjectsData>(this.apiUrl).subscribe(
      (data) => {
        this.ongoingProjects.set(data);
      },
      (error) => {
        console.error('Error fetching projects:', error);
        // Handle error (e.g., display an error message, use mock data)
      }
    );
  }

  updateProject(updatedProject: Project): void {
    // Implement update logic
  }

  // Mock Data - Use this to simulate data without making actual API calls
  private mockProjects: Project[] = [
    {
      name: 'Alipay',
      description: 'Lorem aliquet est risus pretium, cursus.',
      details: [
        'Ultrices at viverra',
        '7 days ago'
      ],
      date: '7 days ago',
      icon: 'https://www.example.com/alipay-icon.png'
    },
    {
      name: 'Angular',
      description: 'Sed facilisis eget elementum quis cum velit massa.',
      details: [
        'Quis rhoncus',
        '3 years ago'
      ],
      date: '3 years ago',
      icon: 'https://www.example.com/angular-icon.png'
    },
    {
      name: 'Alipay',
      description: 'Elit quam adipiscing semper orci malesuada dignissim.',
      details: [
        'Cras amet',
        '7 days ago'
      ],
      date: '7 days ago',
      icon: 'https://www.example.com/alipay-icon.png'
    },
    {
      name: 'Ant Design Pro',
      description: 'Ac mauris fermentum arcu felis facilisi.',
      details: [
        'Cras sed',
        '3 years ago'
      ],
      date: '3 years ago',
      icon: 'https://www.example.com/ant-design-pro-icon.png'
    },
    {
      name: 'Bootstrap',
      description: 'Purus accumsan in sed vestibulum, tellus, nisl.',
      details: [
        'Quis dui',
        '3 years ago'
      ],
      date: '3 years ago',
      icon: 'https://www.example.com/bootstrap-icon.png'
    },
    {
      name: 'React',
      description: 'Vel enim pulvinar massa pharetra, ultricies sed.',
      details: [
        'Phasellus sed',
        '3 years ago'
      ],
      date: '3 years ago',
      icon: 'https://www.example.com/react-icon.png'
    }
  ];
}
