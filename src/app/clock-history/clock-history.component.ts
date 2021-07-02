import { Component, OnInit } from '@angular/core';
import { EmployeesService } from "../employees.service";
import { Observable } from 'rxjs';
import { Task } from "../employee";

@Component({
  selector: 'app-clock-history',
  templateUrl: './clock-history.component.html',
  styleUrls: ['./clock-history.component.css']
})
export class ClockHistoryComponent implements OnInit {

  tasks$!: Observable<Task[]>;

  constructor(private employeesService: EmployeesService) { }

  ngOnInit(): void {this.getEmployees();}

  getEmployees() {
    this.tasks$ = this.employeesService.historyFilter();
  }

}
