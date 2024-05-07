import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from '@coreui/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-report',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, AlertComponent, CommonModule],
  templateUrl: './create-report.component.html',
  styleUrl: './create-report.component.css'
})
export class CreateReportComponent {

  ReportForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required]
  });
  errorMessage : string = '';
  
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  onSubmit() {
    const formData = this.ReportForm.value;
    const projectId = this.route.snapshot.paramMap.get('ProjectId');
    const data = {
      user_id: localStorage.getItem('userId'),
      report_title: formData.title,
      report_description: formData.description
    };
  

  this.http.post('http://localhost:8000/api/reports', data).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['project/:id']);
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.error;
      }
    );
  }

  returnToDashboard() {
    this.router.navigate(['/dashboard']);
  }




}
