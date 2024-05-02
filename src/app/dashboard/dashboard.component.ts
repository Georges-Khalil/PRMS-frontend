import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserServiceService } from '../user-service.service';
import { CommonModule } from '@angular/common';
import { CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilPlus } from '@coreui/icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CardModule, IconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  icons = { cilPlus };
  projects: any[] = [];

  constructor(private http: HttpClient, private userService: UserServiceService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '-1';
    this.http.get<any[]>(`http://localhost:8000/api/user/projects`, { params: { user_id: userId } }).subscribe(
      (projects: any[]) => {
        this.projects = projects;
      },
    );
  }
}
