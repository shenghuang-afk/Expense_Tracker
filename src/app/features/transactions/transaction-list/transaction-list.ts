import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { transaction } from '../../../core/services/transaction';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, NgFor, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css'
})
export class TransactionList{
  private transactionService = inject(transaction);
  transactions$ = this.transactionService.getTransactions();

  async deleteTransaction(id: string) {
    await this.transactionService.deleteTransaction(id);
  }
}