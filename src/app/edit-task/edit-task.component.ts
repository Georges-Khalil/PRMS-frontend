import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, AlertComponent, CommonModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent {
  TaskForm = this.fb.group({
    title: ['', Validators.required],
    currentCount: ['', Validators.required],
    totalCount: ['', Validators.required]
  });
  errorMessage : string = '';
  
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    this.http.get<any>(`http://localhost:8000/api/tasks/${taskId}`).subscribe(
      response => {
        this.TaskForm.patchValue({
          title: response.task_name,
          currentCount: response.current_count,
          totalCount: response.total_count
        });
      },
      error => {
        console.log(error);
        // handle error, show error message
      }
    );
  }
  
  onSubmit() {
    const formData = this.TaskForm.value;
    const taskId = this.route.snapshot.paramMap.get('taskId');

    const data = {
      task_name: formData.title,
      total_count: formData.totalCount,
      current_count: formData.currentCount,
    };


    this.http.put(`http://localhost:8000/api/tasks/${taskId}/update`, data).subscribe(
      response => {
        console.log(response);
        const ProjectId = this.route.snapshot.paramMap.get('projectId');
        const ReportId = this.route.snapshot.paramMap.get('reportId');
        this.router.navigate(['report', ProjectId, ReportId]);
      },
      error => {
        for (let field in error.error.errors) {
          this.errorMessage += `\n${field}: ${error.error.errors[field].join(', ')}`;
        }
        this.errorMessage = this.errorMessage;
      }
    );
  }

  returnToDashboard() {
    const ProjectId = this.route.snapshot.paramMap.get('projectId');
    const ReportId = this.route.snapshot.paramMap.get('reportId');
    this.router.navigate(['report', ProjectId, ReportId]);
  }
}
