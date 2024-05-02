import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserServiceService } from '../user-service.service';
import { CommonModule } from '@angular/common';
import { CardModule } from '@coreui/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  projects: any[] = [];

  constructor(private http: HttpClient, private userService: UserServiceService) {}

  ngOnInit() {
    const userId = this.userService.getUserId();
    this.http.get<any[]>(`http://localhost:8000/api/user/projects`, { params: { user_id: userId } }).subscribe(
      (projects: any[]) => {
        this.projects = projects;
      },
    );
  }
}
