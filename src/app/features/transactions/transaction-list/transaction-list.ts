import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { transaction } from '../../../core/services/transaction';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgFor, RouterLink, MatCardModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css'
})
export class TransactionList {
  private transactionService = inject(transaction);
  private fb = inject(FormBuilder);

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  filterForm = this.fb.group({
    startDate: [''],
    endDate: [''],
    category: [''],
    minAmount: [''],
    maxAmount: ['']
  });

  ngOnInit() {
    this.transactionService.getTransactions().subscribe(data => {
      this.transactions = data;
      this.filteredTransactions = data;
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const { startDate, endDate, category, minAmount, maxAmount } = this.filterForm.getRawValue();

    this.filteredTransactions = this.transactions.filter(t => {
      const dateMatch =
        (!startDate || t.date >= startDate) &&
        (!endDate || t.date <= endDate);

      const categoryMatch =
        !category || t.categoryName.toLowerCase().includes(category.toLowerCase());

      const minMatch =
        !minAmount || t.amount >= Number(minAmount);

      const maxMatch =
        !maxAmount || t.amount <= Number(maxAmount);

      return dateMatch && categoryMatch && minMatch && maxMatch;
    });
  }

  async deleteTransaction(id: string) {
    await this.transactionService.deleteTransaction(id);
  }
}