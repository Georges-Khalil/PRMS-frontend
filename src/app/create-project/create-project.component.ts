import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, AlertComponent, CommonModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  projectForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    members: ['', Validators.required]
  });
  errorMessage : string = '';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {}

  onSubmit() {
    const formData = this.projectForm.value;
    const data = {
      user_id: localStorage.getItem('userId'),
      project_title: formData.title,
      project_description: formData.description,
      member_emails: formData.members
    };

    this.http.post('http://localhost:8000/api/projects', data).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/dashboard']);
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
