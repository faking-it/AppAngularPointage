import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { ClockFormComponent } from "./clock-form/clock-form.component";
import { ClockHistoryComponent } from "./clock-history/clock-history.component";

const routes: Routes = [
  { path: 'employees', component: EmployeeListComponent },
  { path: 'clock', component: ClockFormComponent },
  { path: 'history', component: ClockHistoryComponent },
  { path: '', component: EmployeeListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
