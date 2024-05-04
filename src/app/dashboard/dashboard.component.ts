import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CardModule, IconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  icons = { cilPlus, cilPencil, cilTrash };
  projects: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '-1';
    this.http.get<any[]>(`http://localhost:8000/api/user/projects`, { params: { user_id: userId } }).subscribe(
      (projects: any[]) => {
        this.projects = projects;
      },
    );
  }
  
  onPlusButtonClick() {
    this.router.navigate(['/create-project']);
  }

  editProject(id: number) {
    this.router.navigate(['/edit-project', id]);
  }
}
