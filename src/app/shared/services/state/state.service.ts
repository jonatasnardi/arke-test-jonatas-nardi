import { Injectable } from '@angular/core';
import { IStateProperty } from '../../interfaces/state-property.interface';
import { isJson } from '../../helpers/functions';
import { ITask } from '../../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private tasks: IStateProperty = { persist: true, data: null };
  private selectedTask: IStateProperty = { persist: false, data: null };

  constructor() {
    this.assignPersistedValues();
  }

  // setters
  public setTasks(value: ITask[]) { this.save('tasks', value) };
  public setSelectedTask(value: ITask | null) { this.save('selectedTask', value) };


  // getters
  public getTasks(): ITask[] { return this.get('tasks') };
  public getSelectedTask(): ITask | null { return this.get('selectedTask') };


  private save(property: string, value: any) {
    if (!(this as any)[property]) throw Error('This attribute does not exist in the class. Check that the object and method names are correct and in the standard: ' + property);
    (this as any)[property].data = value;
    if ((this as any)[property].persist) {
      sessionStorage.setItem(property, JSON.stringify(value));
    }
  }

  private get(property: string) {
    return (this as any)[property].data;
  }

  public clear(property: string) {
    (this as any)[property].data = null;
    if ((this as any)[property].persist) {
      sessionStorage.removeItem(property);
    }
  }

  public clearAll() {
    for (let prop in this) {
      if (this.hasOwnProperty(prop) && (this as any)[prop].hasOwnProperty('persist')) {
        (this as any)[prop].data = null;
        sessionStorage.removeItem(prop);
      }
    }
  }

  private assignPersistedValues() {
    for (let prop in this) {
      if (this.hasOwnProperty(prop) && (this as any)[prop].hasOwnProperty('persist')) {
        (this as any)[prop].data = (isJson(sessionStorage.getItem(prop) as any) ? JSON.parse(sessionStorage.getItem(prop) as any) : sessionStorage.getItem(prop)) || null;
      }
    }
  }

}