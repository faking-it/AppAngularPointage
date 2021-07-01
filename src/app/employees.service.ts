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

  getTasks() {
    return this.firestore.collection<Task>('tasks').valueChanges();
  }

  nameFilter (name : string, field: string) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return this.firestore.collection<Employee>('employees', ref => {
      let query : firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
      query = query.where(field, '>=', name).where(field, '<=', name + '\uf8ff');
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

  postTask(data: object) {
    return this.firestore.collection('tasks').add(data);
  }

}
