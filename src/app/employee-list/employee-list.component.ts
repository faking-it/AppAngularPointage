import { Component, OnInit } from '@angular/core';
import { EmployeesService } from "../employees.service";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from "../employee";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees$!: Observable<Employee[]>;

  info!: string;

  constructor(private employeesService: EmployeesService) {}

  ngOnInit(): void {this.getEmployees();}

  getEmployees() {
    this.employees$ = this.employeesService.getAll();
  }

  getEmployeesByName(name: string | null) {
    this.employees$ = this.employeesService.nameFilter(name).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Employee;
        const id2 = a.payload.doc.id;
        
        return { id2, ...data };
      }))
    );
  }

  updateEmployee(name: string | null) {
    if (name === "") {
      this.getEmployees();
      this.info = "";
    }
  }

}
