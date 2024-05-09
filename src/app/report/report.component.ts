import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilPlus, cilPencil, cilTrash, cilGroup, cilChevronTop, cilPaperclip } from '@coreui/icons';
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
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CardModule, IconModule, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, ProgressComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit{
  icons = { cilPlus, cilPencil, cilTrash, cilGroup, cilChevronTop, cilPaperclip };
  tasks: any[] = [];
  deleteModalVisible = false;
  report: any ={};
  taskIdToDelete: number | null = null;
  percentageCompletion: number = 0;

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
          this.percentageCompletion = this.report.completion_percentage;
        },
      );
      
    }
  }

  
  onPlusButtonClick() {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const reportId = this.route.snapshot.paramMap.get('reportId');
    this.router.navigate(['/create-task', projectId, reportId]);
  }

  editTask(taskId: number) {
    const apiUrl = `http://localhost:8000/api/tasks/${taskId}/updateCurrentCount`;

    this.http.put(apiUrl, {}).subscribe(
      response => {
        console.log('API Response:', response);
        location.reload();
      },
      error => {
        console.error('API Error:', error);
      }
    );
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
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const reportId = this.route.snapshot.paramMap.get('reportId');
    this.router.navigate(['/edit-task', projectId, reportId, taskId]);
  }

  fileDL(taskId: number) {
    this.http.get(`http://localhost:8000/api/tasks/${taskId}/attachments`).subscribe(
      (response: any) => {
        const fileData = response.attachments[0].file_data;
        const fileName = response.attachments[0].file_name;
        const fileType = response.attachments[0].file_type;
        const byteCharacters = atob(fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: fileType });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = fileName;
        link.click();
      },
      error => {
        console.log(error);
      }
    );
  }
}
