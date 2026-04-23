import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { transaction } from '../../../core/services/transaction';
import { map } from 'rxjs/operators';
import { NgxEchartsModule } from 'ngx-echarts';
import { combineLatest } from 'rxjs';
import { BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [MatCardModule, CurrencyPipe, AsyncPipe, NgIf, NgFor, NgxEchartsModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome {
  private transactionService = inject(transaction);
  private budgetService = inject(BudgetService);

  monthlyTransactions$ = this.transactionService.getTransactions().pipe(
    map(transactions => {
      const now = new Date();
      return transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    })
  );

  totalIncome$ = this.monthlyTransactions$.pipe(
    map(transactions =>
      transactions.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
    )
  );

  totalExpense$ = this.monthlyTransactions$.pipe(
    map(transactions =>
      transactions.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    )
  );

  pieOptions$ = this.monthlyTransactions$.pipe(
    map(transactions => {
      const grouped: any = {};

      transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          grouped[t.categoryName] = (grouped[t.categoryName] || 0) + t.amount;
        });

      return {
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            data: Object.keys(grouped).map(key => ({
              name: key,
              value: grouped[key]
            }))
          }
        ]
      };
    })
  );

  barOptions$ = this.monthlyTransactions$.pipe(
    map(transactions => {
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        xAxis: {
          type: 'category',
          data: ['Income', 'Expense']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            data: [income, expense]
          }
        ]
      };
    })
  );

  budgetComparison$ = combineLatest([
    this.monthlyTransactions$,
    this.budgetService.getBudgets()
  ]).pipe(
    map(([transactions, budgets]) => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
      const currentBudgets = budgets.filter(b => b.month === currentMonth);
  
      return currentBudgets.map(budget => {
        const actual = transactions
          .filter(t => t.type === 'expense' && t.categoryName === budget.categoryName)
          .reduce((sum, t) => sum + t.amount, 0);
  
        let status = 'Safe';
  
        if (actual > budget.limit) {
          status = 'Exceeded budget';
        } else if (actual >= budget.limit * 0.8) {
          status = 'Nearing budget';
        }
  
        return {
          categoryName: budget.categoryName,
          limit: budget.limit,
          actual,
          remaining: budget.limit - actual,
          status
        };
      });
    })
  );
}