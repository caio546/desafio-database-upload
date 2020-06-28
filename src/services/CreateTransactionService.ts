import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Transaction value is greater than current balance');
    }

    const categoryAlreadyExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (categoryAlreadyExists) {
      const { id } = categoryAlreadyExists;

      const newTransaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: id,
      });

      const savedTransaction = await transactionsRepository.save(
        newTransaction,
      );

      return savedTransaction;
    }

    const newCategory = categoriesRepository.create({
      title: category,
    });

    const savedCategory = await categoriesRepository.save(newCategory);

    const { id } = savedCategory;

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: id,
    });

    const savedTransaction = await transactionsRepository.save(newTransaction);

    return savedTransaction;
  }
}

export default CreateTransactionService;
