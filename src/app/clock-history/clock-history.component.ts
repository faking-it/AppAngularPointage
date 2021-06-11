import { Component, OnInit } from '@angular/core';
import { EmployeesService } from "../employees.service";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from "../employee";

@Component({
  selector: 'app-clock-history',
  templateUrl: './clock-history.component.html',
  styleUrls: ['./clock-history.component.css']
})
export class ClockHistoryComponent implements OnInit {

  employees$!: Observable<Employee[]>;

  constructor(private employeesService: EmployeesService) { }

  ngOnInit(): void {this.getEmployees();}

  getEmployees() {
    this.employees$ = this.employeesService.historyFilter();
  }

}
