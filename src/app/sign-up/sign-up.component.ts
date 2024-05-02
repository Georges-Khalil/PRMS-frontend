import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { cilAt, cilUser, cilLockLocked, cilBriefcase } from '@coreui/icons';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AlertComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, IconModule, HttpClientModule, AlertComponent, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  icons = { cilAt, cilUser, cilLockLocked, cilBriefcase };
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  companyCode: string = '';
  errorMessage : string = '';

  constructor(private http: HttpClient, private router: Router) { }

  signUp() {
    const user = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      company_code: this.companyCode
    };
  
    this.http.post('http://localhost:8000/api/register', user).pipe(
      catchError(error => {
        console.error(error);
        let errorMessage = '';
        for (let field in error.error.errors) {
          errorMessage += `\n${field}: ${error.error.errors[field].join(', ')}`;
        }
        this.errorMessage = errorMessage;
        return throwError(error);
      })
    ).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/login']);
      }
    );
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}
