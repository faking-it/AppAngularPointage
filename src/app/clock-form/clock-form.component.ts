import { Component, Inject, OnInit } from '@angular/core';
import { EmployeesService } from "../employees.service";
import { Employee } from "../employee";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  message: 'error1' | 'error2' | 'error3' | 'success';
}

export interface ClockForm {
  scheduleList: Employee[];
  tasks: [];
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

  updateEmployeeClockIn(employeeId: string | undefined, data: Employee): void {
    this.scheduleDetails = this.scheduleList.find((employee: Employee) => employee.id === employeeId);
    const date = new Date;
    const dateString = date.toLocaleString('fr-BE');
    data.clockInDate = dateString.split(", ")[0];
    data.clockInTime = dateString.split(" ")[1];
    data.clockInTime = data.clockInTime.split(":")[0] + ":" + data.clockInTime.split(":")[1];
    data.clockInHours = data.clockInTime.split(":")[0];
    data.clockInMin = data.clockInTime.split(":")[1];
    this.employeesService.updateEmployee(employeeId, data).then();
  }

  updateEmployeeClockOut(employeeId: string | undefined, data: Employee): void {
    this.scheduleDetails = this.scheduleList.find((employee: Employee) => employee.id === employeeId);
    const date = new Date;
    const dateString = date.toLocaleString('fr-BE');
    data.clockOutTime = dateString.split(" ")[1];
    data.clockOutTime = data.clockOutTime.split(":")[0] + ":" + data.clockOutTime.split(":")[1];
    data.clockOutHours = data.clockOutTime.split(":")[0];
    data.clockOutMin = data.clockOutTime.split(":")[1];
    this.employeesService.updateEmployee(employeeId, data).then();
  }

  updateHoursClockInInput(employeeId: string | undefined, data: Employee): void {
    this.scheduleDetails = this.scheduleList.find((employee: Employee) => employee.id === employeeId);
    data.clockInHoursInput = true;
    this.employeesService.updateEmployee(employeeId, data).then();
  }

  updateHoursClockOutInput(employeeId: string | undefined, data: Employee): void {
    this.scheduleDetails = this.scheduleList.find((employee: Employee) => employee.id === employeeId);
    data.clockOutHoursInput = true;
    this.employeesService.updateEmployee(employeeId, data).then();
  }

  undoClockIn(employeeId: string | undefined, data: Employee): void {
    this.scheduleDetails = this.scheduleList.find((employee: Employee) => employee.id === employeeId);
    data.clockInHoursInput = false;
    this.employeesService.updateEmployee(employeeId, data).then();
  }

  undoClockOut(employeeId: string | undefined, data: Employee): void {
    this.scheduleDetails = this.scheduleList.find((employee: Employee) => employee.id === employeeId);
    data.clockOutHoursInput = false;
    this.employeesService.updateEmployee(employeeId, data).then();
  }

  updateHoursClockIn (employeeId: string | undefined, data: Employee) {
    this.scheduleDetails = this.scheduleList.find((employee: Employee) => employee.id === employeeId);

    if (this.checkoutForm.value.clockInHours != '' && this.checkoutForm.value.clockInHours != null
    && this.checkoutForm.value.clockInMin != '' && this.checkoutForm.value.clockInMin != null) {

      if (data.clockOutTime != "") {
        if (this.checkoutForm.value.clockInHours > data.clockOutHours) {
          this.errorId = 'error1';
          this.openDialog(this.errorId);
        } else if (this.checkoutForm.value.clockInHours == data.clockOutHours && this.checkoutForm.value.clockInMin > data.clockOutMin) {
          this.errorId = 'error1';
          this.openDialog(this.errorId);
        } else {

          if (this.checkoutForm.value.clockInHours < 10) {
            this.checkoutForm.value.clockInHours = "0" + this.checkoutForm.value.clockInHours;
          }
          data.clockInHours = this.checkoutForm.value.clockInHours.toString();
          this.checkoutForm.value.clockInHours = "";
          if (this.checkoutForm.value.clockInMin < 10) {
            this.checkoutForm.value.clockInMin = "0" + this.checkoutForm.value.clockInMin;
          }
          data.clockInMin = this.checkoutForm.value.clockInMin.toString();
          this.checkoutForm.value.clockInMin = "";
          data.clockInTime = data.clockInHours + ":" + data.clockInMin;

          data.clockInHoursInput = false;
          this.employeesService.updateEmployee(employeeId, data).then();
          this.errorId = 'success';
          this.openDialog(this.errorId);
        }
      } else {

        if (this.checkoutForm.value.clockInHours < 10) {
          this.checkoutForm.value.clockInHours = "0" + this.checkoutForm.value.clockInHours;
        }
        data.clockInHours = this.checkoutForm.value.clockInHours.toString();
        this.checkoutForm.value.clockInHours = "";
        if (this.checkoutForm.value.clockInMin < 10) {
          this.checkoutForm.value.clockInMin = "0" + this.checkoutForm.value.clockInMin;
        }
        data.clockInMin = this.checkoutForm.value.clockInMin.toString();
        this.checkoutForm.value.clockInMin = "";
        data.clockInTime = data.clockInHours + ":" + data.clockInMin;

        data.clockInHoursInput = false;
        this.employeesService.updateEmployee(employeeId, data).then();
        this.errorId = 'success';
          this.openDialog(this.errorId);
      }
    } else {
      this.errorId = 'error3';
          this.openDialog(this.errorId);
    }
    
  }

  updateHoursClockOut (employeeId: string | undefined, data: Employee) {
    this.scheduleDetails = this.scheduleList.find((employee: Employee) => employee.id === employeeId);

    if (this.checkoutForm.value.clockOutHours != '' && this.checkoutForm.value.clockOutHours != null
    && this.checkoutForm.value.clockOutMin != '' && this.checkoutForm.value.clockOutMin != null) {

      if (this.checkoutForm.value.clockOutHours < data.clockInHours) {
        this.errorId = 'error2';
          this.openDialog(this.errorId);
      } else if (this.checkoutForm.value.clockOutHours == data.clockInHours && this.checkoutForm.value.clockOutMin < data.clockInMin) {
        this.errorId = 'error2';
          this.openDialog(this.errorId);
      } else {

        if (this.checkoutForm.value.clockOutHours < 10) {
          this.checkoutForm.value.clockOutHours = "0" + this.checkoutForm.value.clockOutHours;
        }
        data.clockOutHours = this.checkoutForm.value.clockOutHours.toString();
        this.checkoutForm.value.clockOutHours = "";
        if (this.checkoutForm.value.clockOutMin < 10) {
          this.checkoutForm.value.clockOutMin = "0" + this.checkoutForm.value.clockOutMin;
        }
        data.clockOutMin = this.checkoutForm.value.clockOutMin.toString();
        this.checkoutForm.value.clockOutMin = "";
        data.clockOutTime = data.clockOutHours + ":" + data.clockOutMin;

        data.clockOutHoursInput = false;
        this.employeesService.updateEmployee(employeeId, data).then();
        this.errorId = 'success';
          this.openDialog(this.errorId);
      }

    } else {
      this.errorId = 'error3';
          this.openDialog(this.errorId);
    }
    
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

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  test(data: Employee): void {
    const employeeId = "4iY7Ee7uEIuu6SAZVUVX";
    this.scheduleDetails = this.scheduleList.find((employee: Employee) => employee.id === employeeId);
    const date = new Date;
    const dateString = date.toLocaleString('fr-BE');

    data.dates.item.date = dateString.split(", ")[0];
    data.dates.item.item.time = dateString.split(" ")[1];
    data.dates.item.item.time = data.clockInTime.split(":")[0] + ":" + data.clockInTime.split(":")[1];
    
    this.employeesService.updateEmployee(employeeId, data).then();
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
export class ClockFormPopUp {
  clockForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ClockFormPopUp>,
    @Inject(MAT_DIALOG_DATA) public data: ClockForm) {

      this.clockForm = this.formBuilder.group({
        name: ['', Validators.required],
        time: ['', Validators.required],
        task: ['', Validators.required],
        comment: ''
      })
    }
  
  save(): void {
    console.log(this.clockForm);
    console.log('Saved: ' + JSON.stringify(this.clockForm.value));
  }

}
