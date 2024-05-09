import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilPlus, cilPencil, cilTrash, cilGroup, cilChevronTop } from '@coreui/icons';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
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
import { ProgressComponent } from '@coreui/angular';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CardModule, IconModule, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, ProgressComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit{
  icons = { cilPlus, cilPencil, cilTrash, cilGroup, cilChevronTop };
  reports: any[] = [];
  deleteModalVisible = false;
  reportIdToDelete: number | null = null;
  project: any = {};
  emails: string = '';
  count: number = 0;
  percentageCompletion: number = 0;


  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.http.get<any>(`http://localhost:8000/api/projects/${projectId}/details`, { params: { project_id: projectId } }).subscribe(
        (response: any) => {
          this.project = response.project;
          this.emails = response.user_emails;
          this.percentageCompletion = this.project.completion_percentage;
          this.count = this.emails.split(',').length;
          console.log(this.emails);
          console.log(this.count);
        },
      );
      this.http.get<any[]>(`http://localhost:8000/api/projects/${projectId}/reports`, { params: { project_id: projectId } }).subscribe(
        (reports: any[]) => {
          this.reports = reports;
        },
      );
      
    }
  }

  
  onPlusButtonClick() {
    this.router.navigate(['/create-report', this.project.project_id]);
  }

  editReport(reportId: number) {
    this.router.navigate(['/edit-report', this.project.project_id, reportId]);
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

  goToReport(reportId: number) {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/report', projectId, reportId]);
  }
}
