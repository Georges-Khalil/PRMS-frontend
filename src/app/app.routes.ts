import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ProjectComponent } from './project/project.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { EditReportComponent } from './edit-report/edit-report.component';
import { ReportComponent } from './report/report.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { CreateTaskComponent } from './create-task/create-task.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'create-project', component: CreateProjectComponent },
    { path: 'edit-project/:id', component: EditProjectComponent },
    { path: 'project/:id', component: ProjectComponent },
    { path: 'create-report/:projectId', component: CreateReportComponent },
    { path: 'edit-report/:projectId/:reportId', component: EditReportComponent },
    { path: 'report/:projectId/:reportId', component: ReportComponent },
    { path: 'edit-task/:projectId/:reportId/:taskId', component: EditTaskComponent},
    { path: 'create-task/:projectId/:reportId', component: CreateTaskComponent}
];
