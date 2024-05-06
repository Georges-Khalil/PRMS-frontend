import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons';
import { Router } from '@angular/router';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective
} from '@coreui/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CardModule, IconModule, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  icons = { cilPlus, cilPencil, cilTrash };
  projects: any[] = [];
  deleteModalVisible = false;
  projectIdToDelete: number | null = null;

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

  openDeleteModal(projectId: number) {
    this.projectIdToDelete = projectId;
    this.deleteModalVisible = true;
  }

  closeDeleteModal() {
    this.deleteModalVisible = false;
  }

  handleDeleteModalChange(event: any) {
    this.deleteModalVisible = event;
  }

  deleteProject() {
    if (this.projectIdToDelete !== null) {
      this.http.delete(`http://localhost:8000/api/projects/${this.projectIdToDelete}`).subscribe(
        response => {
          this.closeDeleteModal();
          this.ngOnInit();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  goToProject(id: number) {
    this.router.navigate(['/project', id]);
  }
}
