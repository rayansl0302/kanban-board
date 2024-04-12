import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../model/card/user/user.module';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) { }

  // Retorna todos os usuários
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  // Retorna um usuário pelo ID
  getUserById(userId: string): Observable<User> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.get<User>(url);
  }

  // Adiciona um novo usuário
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  // Atualiza um usuário existente
  updateUser(user: User): Observable<User> {
    const url = `${this.baseUrl}/${user.id}`;
    return this.http.put<User>(url, user);
  }

  // Remove um usuário pelo ID
  deleteUser(userId: string): Observable<User> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.delete<User>(url);
  }

  // Retorna o nome e e-mail do usuário pelo ID
  getUserName(userId: string): Observable<string> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`).pipe(
      map((user: User) => `${user.nome}, ${user.email}`)
    );
  }
}
