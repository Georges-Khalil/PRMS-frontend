import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, AlertComponent, CommonModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent {
  projectForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    members: ['', Validators.required]
  });
  errorMessage : string = '';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.http.get<{ project: any, user_emails: string }>(`http://localhost:8000/api/projects/${projectId}/details`).subscribe(
      response => {
        const project = response.project;
        this.projectForm.patchValue({
          title: project.project_title,
          description: project.project_description,
          members: response.user_emails
        });
      },
      error => {
        console.log(error);
        // handle error, show error message
      }
    );
  }

  onSubmit() {
    const formData = this.projectForm.value;
    const projectId = this.route.snapshot.paramMap.get('id');
    const data = {
      project_title: formData.title,
      project_description: formData.description,
      member_emails: formData.members
    };

    this.http.put(`http://localhost:8000/api/projects/${projectId}`, data).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/dashboard']);
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
    this.router.navigate(['/dashboard']);
  }
}
