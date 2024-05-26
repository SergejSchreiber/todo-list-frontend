import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-all-todos',
  templateUrl: './all-todos.component.html',
  styleUrls: ['./all-todos.component.scss']
})
export class AllTodosComponent {
  todos: any = [];
  error = "";
  title: string = "";
  description: string = "";
  created_at: string = "";
  due_date: string = "";
  priority: string = "";
  status: string = "";

  statusOptions: string[] = ['To-do', 'Do today', 'In Process', 'Done']

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    try {
      this.todos = await this.loadTodos();
      console.log(this.todos);
    } catch(e) {
      this.error = 'Fehler beim Laden';
    }
  }

  loadTodos() {
    const url = environment.baseUrl + "/todos/";
    return lastValueFrom(this.http.get(url));
  }

  filterToDo(todos: any[]): any[] {
    return todos.filter(p => p.status === "To-do");
  }

  filterDoToday(todos: any[]): any[] {
    return todos.filter(p => p.status === "Do today");
  }

  filterInProcess(todos: any[]): any[] {
    return todos.filter(p => p.status === "In Process");
  }

  filterDone(todos: any[]): any[] {
    return todos.filter(p => p.status === "Done");
  }

  async addTodo() {
    const url = environment.baseUrl + "/todos/";
    const body = {
      "title": this.title,
      "description": this.description,
      "created_at": new Date().toISOString().split('T')[0], // format YYYY-MM-DD
      "due_date": new Date(this.due_date).toISOString().split('T')[0], // format YYYY-MM-DD
      "priority": this.priority,
      "status": this.status,
      "author": 2
    };
    try {
      const response = await lastValueFrom(this.http.post(url, body));
      this.todos.push(response);
    } catch (error) {
      console.error(error);
      this.error = 'Fehler beim Hinzufügen des Todos';
    }
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
    (event.currentTarget as HTMLElement).classList.add('drag-over');
  }

  onDragEnter(event: DragEvent) {
    (event.currentTarget as HTMLElement).classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    (event.currentTarget as HTMLElement).classList.remove('drag-over');
  }

  onDragStart(event: DragEvent, todo: any) {
    event.dataTransfer?.setData("todo", JSON.stringify(todo));
  }

  async onDrop(event: DragEvent, newStatus: string) {
    event.preventDefault();
    const todo = JSON.parse(event.dataTransfer?.getData("todo") || '{}');
    todo.status = newStatus;

    (event.currentTarget as HTMLElement).classList.remove('drag-over');

    const url = `${environment.baseUrl}/todos/${todo.id}/`;
    const body = {
      "status": newStatus
    };
    
    try {
      await lastValueFrom(this.http.patch(url, body));
      this.todos = this.todos.map((t: any) => t.id === todo.id ? { ...t, status: newStatus } : t);
    } catch (error) {
      console.error(error);
      this.error = 'Fehler beim Aktualisieren des Todo-Status';
    }
  }
}
