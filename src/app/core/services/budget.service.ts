import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { Budget } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private budgetsCollection = collection(this.firestore, 'budgets');

  getBudgets(): Observable<Budget[]> {
    const user = this.auth.currentUser;

    if (!user) return of([]);

    const budgetsQuery = query(
      this.budgetsCollection,
      where('userId', '==', user.uid)
    );

    return collectionData(budgetsQuery, { idField: 'id' }) as Observable<Budget[]>;
  }

  addBudget(budget: Budget) {
    return addDoc(this.budgetsCollection, budget);
  }
}