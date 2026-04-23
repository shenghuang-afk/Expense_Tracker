import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class transaction {
  private firestore = inject(Firestore);
  private transactionsCollection = collection(this.firestore, 'transactions');

  getTransactions(): Observable<Transaction[]> {
    return collectionData(this.transactionsCollection, {
      idField: 'id'
    }) as Observable<Transaction[]>;
  }

  addTransaction(transaction: Transaction) {
    return addDoc(this.transactionsCollection, transaction);
  }

  updateTransaction(id: string, transaction: Partial<Transaction>) {
    const transactionDoc = doc(this.firestore, `transactions/${id}`);
    return updateDoc(transactionDoc, transaction);
  }

  deleteTransaction(id: string) {
    const transactionDoc = doc(this.firestore, `transactions/${id}`);
    return deleteDoc(transactionDoc);
  }
}