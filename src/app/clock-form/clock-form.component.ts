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

  public employees: Employee[] = [];
  public scheduleDetails!: Employee | undefined;

  tasks: any[] = [];

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
    this.employeesService.getTasks().subscribe(res => {
      this.tasks = res.map((task: any) => {
        return {
          ...task.payload.doc.data(),
          id: task.payload.doc.id
        } as any;
      });
    });

    this.employeesService.getEmployees().subscribe(res => {
      this.employees = res.map((employee: any) => {
        return {
          ...employee.payload.doc.data(),
          id: employee.payload.doc.id,
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
        employees: this.employees,
        update: false,
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

  updateForm(item: Task): void {
    const dialogRef = this.dialog.open(ClockFormPopUp, {
      data: {
        update: true,
        employees: this.employees,
        name: item.forename,
        tasks: [
          "Arrivée",
          "Programmation",
          "Livraison",
          "Chaine",
          "Pause",
          "Départ"
        ],
        task: item.task,
        timeIn: item.timeIn,
        id: item.id
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
    timeIn: "",
    timeOut: "",
    task: "",
    comment: "",
    employeeId: "",
    forename: "",
    surname: ""
  };

  constructor(
    private employeesService: EmployeesService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ClockFormPopUp>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    
    if (this.data.update == true) {
      this.clockForm = this.formBuilder.group({
        name: [{value: this.data.name, disabled: true}, Validators.required],
        time: ['', Validators.required],
        task: [{value: this.data.task, disabled: true}, Validators.required],
        comment: '',
        id: '',
        surname: ''
      });
    } else {
      this.clockForm = this.formBuilder.group({
        name: ['', Validators.required],
        time: ['', Validators.required],
        task: ['', Validators.required],
        comment: '',
        id: '',
        surname: ''
      })
    }
    
  }
  
  save(): void {
    console.log(this.clockForm);
    console.log('Saved: ' + JSON.stringify(this.clockForm.value));

    const date = new Date;
    const dateString = date.toLocaleString('fr-BE');
    
    if (this.data.update == true) {
      const payload = {timeOut: this.clockForm.value.time};
      this.employeesService.updateTask(this.data.id, payload);
    } else {
      this.formData.date = dateString.split(", ")[0];
      this.formData.timeIn = this.clockForm.value.time;
      this.formData.task = this.clockForm.value.task;
      this.formData.comment = this.clockForm.value.comment;
      this.formData.employeeId = this.clockForm.value.id;
      this.formData.forename = this.clockForm.value.name;
      this.formData.surname = this.clockForm.value.surname;
      
      this.employeesService.postTask(this.formData)
    }

    this.dialogRef.close();
  }

}
