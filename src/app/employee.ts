import { Observable } from "rxjs";

export interface Employee {
     id?: string;
     forename: string;
     surname: string;
     position: string;
     clockInDate: string;
     clockInTime: string;
     clockOutTime: string;
     clockInHoursInput: boolean;
     clockInHours: string;
     clockInMinInput: boolean;
     clockInMin: string;
     clockOutHoursInput: boolean;
     clockOutHours: string;
     clockOutMinInput: boolean;
     clockOutMin: string;
}
 export interface Task {
      id?: string;
      date: string;
      timeIn: string;
      timeOut: string;
      task: string;
      comment: string;
      emloyeeId: string;
      forename: string;
      surname: string;
 }