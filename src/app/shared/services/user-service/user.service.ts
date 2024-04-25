import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../../model/card/user/user.module';
import { Quadro } from '../../model/card/quadro/quadro.module';
import firebase from 'firebase/compat/app'; // Importe firebase
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) { }

  // Métodos para usuários /////////////////////////////////////////////////////////////////////

  getCurrentUser(): Observable<User | null> {
    return this.afAuth.authState.pipe(
      map(user => {
        if (user) {
          return {
            nome: user.displayName || '',
            email: user.email || '',
            quadro: [] // Defina os quadros do usuário conforme necessário
          };
        } else {
          return null;
        }
      })
    );
  }

  async getUidByEmail(email: string): Promise<string | null> {
    try {
      const userCredential = await this.afAuth.fetchSignInMethodsForEmail(email);
      if (userCredential && userCredential[0]) {
        return userCredential[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao obter UID pelo e-mail:', error);
      return null;
    }
  }

  getUsers(): Observable<User[]> {
    return this.db.list<User>('users').snapshotChanges().pipe(
      map(users => {
        return users.map(user => {
          const data = user.payload.val() as User;
          const uid = user.payload.key; // Obtém o UID do usuário
          const { email, ...userData } = data; // Remove a propriedade email do objeto de dados
          return { uid, email, ...userData }; // Retorna um objeto de usuário com UID, e-mail e outras informações
        });
      }),
      tap(users => {
        console.log('Usuários recuperados:');
        users.forEach(user => {
          console.log('Email:', user.email, 'Nome:', user.nome, 'UID:', user.uid);
        });
      }),
      catchError(error => {
        console.error('Erro ao recuperar usuários:', error);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }
  getUser(uid?: string): Observable<User | undefined> {
    if (uid) {
      return this.db.object<User>(`users/${uid}`).valueChanges().pipe(
        map(user => user ? user : undefined)
      );
    } else {
      return this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.db.object<User>(`users/${user.uid}`).valueChanges().pipe(
              map(userData => userData ? userData : undefined)
            );
          } else {
            return of(undefined);
          }
        })
      );
    }
  }




  observeAuthState(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Novo usuário autenticado, adiciona ao banco de dados em tempo real
        this.addUserToDatabase(user);
        this.setUserIdToLocalStorage(user.uid);

      }
    });
  }

  private addUserToDatabase(user: firebase.User): void {
    const userData: User = {
      uid: user.uid,
      email: user.email || '',
      nome: user.displayName || '',
      quadro: [] // Agora quadro é um array de Quadro
      // Adicione outros detalhes do usuário conforme necessário
    };

    // Verifica se os detalhes do usuário já existem no banco de dados
    this.db.object<User>(`users/${user.uid}`).valueChanges().subscribe(existingUserData => {
      if (!existingUserData) {
        // Se não existirem, adiciona os detalhes do usuário ao banco de dados
        this.db.object(`users/${user.uid}`).set(userData);
      }
    });
  }

  // Adiciona um quadro ao usuário
  addQuadroToUser(userId: string, quadro: Quadro): void {
    this.db.list<Quadro>(`users/${userId}/quadro`).push(quadro);
  }
  // Método para definir o ID do usuário no armazenamento local
  private setUserIdToLocalStorage(userId: string): void {
    localStorage.setItem('userId', userId);
    console.log('userid do user service', userId);
  }

}
