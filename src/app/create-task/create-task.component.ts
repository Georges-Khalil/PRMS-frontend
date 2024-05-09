import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, AlertComponent, CommonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  TaskForm = this.fb.group({
    title: ['', Validators.required],
    totalCount: ['', Validators.required]
  });
  errorMessage : string = '';
  
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private route: ActivatedRoute) {}
  
  onSubmit() {
    const formData = this.TaskForm.value;
    const ReportId = this.route.snapshot.paramMap.get('reportId');

    const data = {
      task_name: formData.title,
      total_count: formData.totalCount,
      report_id:ReportId

    };
  

  this.http.post('http://localhost:8000/api/tasks', data).subscribe(
      response => {
        console.log(response);
        const ProjectId = this.route.snapshot.paramMap.get('projectId');
        this.router.navigate(['report', ProjectId, ReportId]);
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.error;
      }
    );
  }

  returnToDashboard() {
    const ProjectId = this.route.snapshot.paramMap.get('projectId');
    const ReportId = this.route.snapshot.paramMap.get('reportId');
    this.router.navigate(['report', ProjectId, ReportId]);
  }
}
