// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (transaction) {
      await transactionsRepository.delete(id);
    }
  }
}

export default DeleteTransactionService;
