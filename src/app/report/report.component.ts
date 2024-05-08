import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilPlus, cilPencil, cilTrash, cilGroup } from '@coreui/icons';
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

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CardModule, IconModule, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit{
  icons = { cilPlus, cilPencil, cilTrash, cilGroup };
  tasks: any[] = [];
  deleteModalVisible = false;
  report: any ={};
  taskIdToDelete: number | null = null;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const reportId = this.route.snapshot.paramMap.get('reportId');
    console.log(reportId);
    if (reportId) {
      this.http.get<any[]>(`http://localhost:8000/api/reports/${reportId}/tasks`, { params: { report_id: reportId } }).subscribe(
        (tasks: any[]) => {
          this.tasks = tasks;
        },
      );
      
    this.http.get<any[]>(`http://localhost:8000/api/reports/${reportId}/details`, { params: { report_id: reportId } }).subscribe(
        (response: any) => {
          this.report = response.report;
        },
      );
      
    }
  }

  
  onPlusButtonClick() {
    this.router.navigate(['/create-task', this.report.report_id]);
  }

  editTask(taskId: number) {
    this.router.navigate(['/edit-task', this.report.project_id, taskId]);
  }

  openDeleteModal(taskId: number) {
    this.taskIdToDelete = taskId;
    this.deleteModalVisible = true;
  }

  closeDeleteModal() {
    this.deleteModalVisible = false;
  }

  handleDeleteModalChange(event: any) {
    this.deleteModalVisible = event;
  }

  deleteTask() {
    if (this.taskIdToDelete !== null) {
      this.http.delete(`http://localhost:8000/api/tasks/${this.taskIdToDelete}/`).subscribe(
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

  goToTask(taskId: number) {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/task', projectId, taskId]);
  }
}
