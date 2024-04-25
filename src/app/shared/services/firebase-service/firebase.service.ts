import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Quadro } from '../../model/card/quadro/quadro.module';
import { Card } from '../../model/card/card/card.module';
import { User } from '../../model/card/user/user.module';
import { Comment } from '../../model/comment/comment.model';
import { Data } from '../../model/data/data.model';
import { AuthService } from '../auth-service/auth-service.service';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  private cardSource = new BehaviorSubject<Card | null>(null);
  currentCard = this.cardSource.asObservable();
  private selectedCardSubject = new Subject<Card>();
  selectedCard: BehaviorSubject<Card | null> = new BehaviorSubject<Card | null>(null);

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {

  }



 
  
}
