import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class transaction {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private transactionsCollection = collection(this.firestore, 'transactions');

  getTransactions(): Observable<Transaction[]> {
    const user = this.auth.currentUser;

    if (!user) return of([]);

    const transactionsQuery = query(
      this.transactionsCollection,
      where('userId', '==', user.uid)
    );

    return collectionData(transactionsQuery, { idField: 'id' }) as Observable<Transaction[]>;
  }

  getTransactionById(id: string): Observable<Transaction> {
    const transactionDoc = doc(this.firestore, `transactions/${id}`);
    return docData(transactionDoc, { idField: 'id' }) as Observable<Transaction>;
  }

  addTransaction(transactionData: Transaction) {
    return addDoc(this.transactionsCollection, transactionData);
  }

  updateTransaction(id: string, transactionData: Partial<Transaction>) {
    const transactionDoc = doc(this.firestore, `transactions/${id}`);
    return updateDoc(transactionDoc, transactionData);
  }

  deleteTransaction(id: string) {
    const transactionDoc = doc(this.firestore, `transactions/${id}`);
    return deleteDoc(transactionDoc);
  }

  getCurrentMonthTransactions(): Observable<Transaction[]> {
    const user = this.auth.currentUser;
    if (!user) return of([]);
  
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
    const transactionsQuery = query(
      this.transactionsCollection,
      where('userId', '==', user.uid)
    );
  
    return collectionData(transactionsQuery, { idField: 'id' }) as Observable<Transaction[]>;
  }
}