import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private _baseUrl = 'http://localhost:3000/todos';

  public todos$ = new BehaviorSubject<Todo[]>([]);
  public todo$  = new BehaviorSubject<Todo>({});

  constructor(private _http: HttpClient) {
    // pour tester on renseigne le tableau avec une tâche
    // setTimeout(()=>{
    //   this.todos$.next([{'id': '1', 'text': 'Test', 'done': true }]) ;
    // }, 1000);
  };

  // GET todos
  findAll(): Observable<Todo[]> {
    return this._http
               .get<Todo[]>(this._baseUrl)
               .pipe(
                  tap(todos => this.todos$.next(todos))
               );
  }
  // GET todo
  findById(id: string): Observable<Todo> {
    return this._http
               .get<Todo>(this._baseUrl + "/" + id)
               .pipe(
                  tap(todo => this.todo$.next(todo))
               );
  }
  // POST todo
  createOne(t: Todo): Observable<Todo> {
    return this._http
               .post<Todo>(this._baseUrl, t)
               .pipe(
                  tap(t => {
                    //this.todo$.next(todo)
                    const todos = this.todos$.value;
                    todos.unshift(t);
                    this.todos$.next([...todos] /* création d'un nouveau tableau [...todos] 
                    qui possède les valeurs de todos pour écraser le todos$ */);
                  })
               );
    // todo§ est à jour il faut l'insérer dans le todos$.
  }
  // PUT todo
  editOne(t: Todo): Observable<Todo> {
    return this._http
               .put<Todo>(`${this._baseUrl}/${t.id}`, t)
               .pipe(
                  tap(todo => {
                    const todos = this.todos$.value;
                    todos.splice(todos.findIndex(to => to.id == todo.id),1,todo);
                    this.todos$.next([...todos]);
                  })
                );
  }
  // DELETE todo
  deleteOne(t: Todo): Observable<Todo> {
    return this._http
        .delete<Todo>(`${this._baseUrl}/${t.id}`)
        .pipe(
            tap(() => {
              const todos = this.todos$.value;
              todos.splice(todos.findIndex(to => to.id == t.id),1);
              console.log(todos);
              this.todos$.next([...todos]);
            })
        );
  }

}
