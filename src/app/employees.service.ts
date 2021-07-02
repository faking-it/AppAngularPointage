import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Employee, Task } from "./employee";

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private firestore: AngularFirestore) {}

  getAll() {
    return this.firestore.collection<Employee>('employees').valueChanges();
  }

  nameFilter (name : string, surname: string) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    surname = surname.charAt(0).toUpperCase() + surname.slice(1);
    return this.firestore.collection<Employee>('employees', ref => {
      let query : firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
      query = query
        .where("forename", '>=', name)
        .where("forename", '<=', name + '\uf8ff')
        /*.where("surname", ">=", surname)
        .where("surname", "<=", surname + '\uf8ff');*/
      
      return query;
    }).snapshotChanges();
  }

  getEmployees() {
    return this.firestore.collection<Employee>('employees').snapshotChanges();
  }

  getTasks(){
    const date = new Date;
    const dateString = date.toLocaleString('fr-BE');
    return this.firestore.collection<Task>('tasks', ref => {
      let query : firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
      query = query.where('date', '==', dateString.split(", ")[0]);
      return query;
    }).snapshotChanges();
  }

  updateEmployee(employeeId: string | undefined, payload: Employee) {
    return this.firestore.doc('employees/' + employeeId).update(payload);
  }

  updateTask(employeeId: string, payload: any) {
    return this.firestore.doc('tasks/' + employeeId).update(payload);
  }

  historyFilter () {
    return this.firestore.collection<Task>('tasks', ref => {
      let query : firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
      query = query.where('date', '!=', '');
      return query;
    }).valueChanges();
  }

  postTask(data: object) {
    return this.firestore.collection('tasks').add(data);
  }

}
