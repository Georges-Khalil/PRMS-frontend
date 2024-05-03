import { Component } from '@angular/core';
import { cilUser, cilLockLocked } from '@coreui/icons';
import { IconModule } from '@coreui/icons-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '@coreui/angular';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IconModule, HttpClientModule, FormsModule, AlertComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  icons = { cilUser, cilLockLocked};
  email: string = '';
  password: string = '';
  errorMessage : string = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    this.http.post('http://localhost:8000/api/login', { email: this.email, password: this.password })
      .pipe(
        catchError(error => {
          this.errorMessage = error.error.message;
          console.error(error);
          return throwError(error);
        })
      )
      .subscribe((response: any) => {
        console.log(response);
        localStorage.setItem('userId', response.id);
        this.router.navigate(['/dashboard']);
      });
  }

  signUp() {
    this.router.navigate(['/sign-up']);
  }
}
