import { Component, OnInit } from '@angular/core';
import { EmployeesService } from "../employees.service";
import { Observable, timer } from 'rxjs';
import { debounce, map } from 'rxjs/operators';
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

  updateEmployee(forename: string, surname: string) {
    this.employees$ = this.employeesService.nameFilter(forename.toLowerCase(), surname.toLowerCase()).pipe(
      debounce(() => timer(500)),
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Employee;
        const id2 = a.payload.doc.id;
        
        return { id2, ...data };
      }))
    );

    if (forename === "" && surname === "") {
      this.getEmployees();
      this.info = "";
    }
  }

}
