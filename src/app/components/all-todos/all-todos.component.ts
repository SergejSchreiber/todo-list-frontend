import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-all-todos',
  templateUrl: './all-todos.component.html',
  styleUrl: './all-todos.component.scss'
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

  

  addTodo() {
    const url = environment.baseUrl + "/todos/";
    const body = {
      "title": this.title,
      "description": this.description,
      // "created_at": this.created_at,
      "due_date": this.due_date,
      "priority": this.priority,
      "status": this.status,
      "author":2
    }
    return lastValueFrom(this.http.post(url, body));
  }

}
