import { Component, Inject, OnInit } from '@angular/core';
import { EmployeesService } from "../employees.service";
import { Employee, Task } from "../employee";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';

export interface DialogData {
  message: 'error1' | 'error2' | 'error3' | 'success';
}

@Component({
  selector: 'app-clock-form',
  templateUrl: './clock-form.component.html',
  styleUrls: ['./clock-form.component.css']
})
export class ClockFormComponent implements OnInit {

  public scheduleList: Employee[] = [];
  public scheduleDetails!: Employee | undefined;

  inputHours!: string;

  checkoutForm = this.formBuilder.group({
    clockInHours: '',
    clockInMin: '',
    clockOutHours: '',
    clockOutMin: ''
  });

  errorId!: string;

  constructor(
    private employeesService: EmployeesService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    ) {}

  ngOnInit(): void {
    this.getSchedules();
    this.updateInputs();
  }

  getSchedules(): void {
    this.employeesService.getSchedules().subscribe(res => {
      this.scheduleList = res.map((employee: any) => {
        return {
          ...employee.payload.doc.data(),
          id: employee.payload.doc.id
        } as Employee;
      });
    });
  }

  updateInputs() {}

  openDialog(error: string) {
    this.dialog.open(DialogDataError, {
      data: {
        message: error
      }
    });
  }

  openForm(): void {
    const dialogRef = this.dialog.open(ClockFormPopUp, {
      data: {
        scheduleList: this.scheduleList,
        
        tasks: [
          "Arrivée",
          "Programmation",
          "Livraison",
          "Chaine",
          "Pause",
          "Départ"
        ]
      }
    });

  }

}

@Component({
  selector: 'clock-form.component-dialog',
  templateUrl: 'clock-form.component-dialog.html',
})
export class DialogDataError {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

@Component({
  selector: 'clock-form.component-form',
  templateUrl: 'clock-form.component-form.html',
})
export class ClockFormPopUp implements OnInit{
  clockForm!: FormGroup;
  public formData = {
    date : "",
    time: "",
    task: "",
    comment: "",
    employeeId: ""
  };

  constructor(
    private employeesService: EmployeesService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ClockFormPopUp>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    
    this.clockForm = this.formBuilder.group({
      name: ['', Validators.required],
      time: ['', Validators.required],
      task: ['', Validators.required],
      comment: '',
      id: ''
    })
  }
  
  save(): void {
    console.log(this.clockForm);
    console.log('Saved: ' + JSON.stringify(this.clockForm.value));

    const date = new Date;
    const dateString = date.toLocaleString('fr-BE');

    this.formData.date = dateString.split(", ")[0];
    this.formData.time = this.clockForm.value.time;
    this.formData.task = this.clockForm.value.task;
    this.formData.comment = this.clockForm.value.comment;
    this.formData.employeeId = this.clockForm.value.id;
    
    this.employeesService.postTask(this.formData)
    
  }

}
