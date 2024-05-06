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
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CardModule, IconModule, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit{
  icons = { cilPlus, cilPencil, cilTrash };
  reports: any[] = [];
  projectDescription: string = '';
  deleteModalVisible = false;
  reportIdToDelete: number | null = null;
  project: any = {}; // Define project property


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    
    const projectId = localStorage.getItem('projectId') || '-1';
  
    this.http.get<any[]>(`http://localhost:8000/api/projects/${projectId}/reports`, { params: { project_id: projectId } }).subscribe(
      (reports: any[]) => {
        this.reports = reports;
      },
      
    );
    this.http.get<any>('http://localhost:8000/api/projects/${projectId}/details', { params: { project_id: projectId } }).subscribe(
      (projectData: any) => {
        this.project = projectData;
      },
      
  }

  
  onPlusButtonClick() {
    this.router.navigate(['/create-report']);
  }

  editReport(id: number) {
    this.router.navigate(['/edit-report', id]);
  }

  openDeleteModal(reportId: number) {
    this.reportIdToDelete = reportId;
    this.deleteModalVisible = true;
  }

  closeDeleteModal() {
    this.deleteModalVisible = false;
  }

  handleDeleteModalChange(event: any) {
    this.deleteModalVisible = event;
  }

  deleteReport() {
    if (this.reportIdToDelete !== null) {
      this.http.delete(`http://localhost:8000/api/reports/${this.reportIdToDelete}/`).subscribe(
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

  goToProject(projectId: number) {
    this.router.navigate(['/reports', projectId]);
  }
}
