import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Employee } from "./employee";

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private firestore: AngularFirestore) {}

  getAll() {
    return this.firestore.collection<Employee>('employees').valueChanges();
  }

  nameFilter (name : string | null) {
    return this.firestore.collection<Employee>('employees', ref => {
      let query : firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
      query = query.where('forename', '==', name);
      return query;
    }).snapshotChanges();
  }

  getSchedules(){
    return this.firestore.collection('employees').snapshotChanges();
  }

  updateEmployee(employeeId: string | undefined, payload: Employee) {
    return this.firestore.doc('employees/' + employeeId).update(payload);
  }

  historyFilter () {
    return this.firestore.collection<Employee>('employees', ref => {
      let query : firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
      query = query.where('clockInDate', '!=', '');
      return query;
    }).valueChanges();
  }

}
