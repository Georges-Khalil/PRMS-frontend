import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-report',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, AlertComponent, CommonModule],
  templateUrl: './edit-report.component.html',
  styleUrl: './edit-report.component.css'
})
export class EditReportComponent {
  reportForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });
  errorMessage : string = '';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const reportId = this.route.snapshot.paramMap.get('reportId');
    this.http.get<{ report: any }>(`http://localhost:8000/api/reports/${reportId}/details`).subscribe(
      response => {
        const report = response.report;
        this.reportForm.patchValue({
          title: report.report_title,
          description: report.report_description,
          
        });
      },
      error => {
        console.log(error);
        // handle error, show error message
      }
    );
  }

  onSubmit() {
    const formData = this.reportForm.value;
    const reportId = this.route.snapshot.paramMap.get('reportId');
    const data = {
      report_title: formData.title,
      report_description: formData.description,
    };

    this.http.put(`http://localhost:8000/api/reports/${reportId}`, data).subscribe(
      response => {
        console.log(response);
        const projectId = this.route.snapshot.paramMap.get('projectId');
        this.router.navigate(['/project', projectId]);
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
    const projectId = this.route.snapshot.paramMap.get('projectId');
    this.router.navigate(['/project', projectId]);
  }
}
