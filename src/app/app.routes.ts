import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { DashboardHome } from './features/dashboard/dashboard-home/dashboard-home';
import { TransactionList } from './features/transactions/transaction-list/transaction-list';
import { TransactionForm } from './features/transactions/transaction-form/transaction-form';
import { authGuard } from './core/guards/auth-guard';
import { BudgetForm } from './features/budgets/budget-form/budget-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: DashboardHome, canActivate: [authGuard] },
  { path: 'transactions', component: TransactionList, canActivate: [authGuard] },
  { path: 'transactions/new', component: TransactionForm, canActivate: [authGuard] },
  { path: 'transactions/edit/:id', component: TransactionForm, canActivate: [authGuard] },
  { path: 'budgets/new', component: BudgetForm, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];