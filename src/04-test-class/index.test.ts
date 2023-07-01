import {
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
  getBankAccount,
} from './index';

const initialBalance = 100;
const initialBalance2 = 200;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(initialBalance);

    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawAmount = 200;
    const account = getBankAccount(initialBalance);

    expect(() => account.withdraw(withdrawAmount)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(initialBalance);
    const account2 = getBankAccount(initialBalance2);
    const transferAmount = 200;

    expect(() => account1.transfer(transferAmount, account2)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const transferAmount = 50;
    const account = getBankAccount(initialBalance);

    expect(() => account.transfer(transferAmount, account)).toThrowError(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const depositAmount = 50;
    const account = getBankAccount(initialBalance);
    account.deposit(depositAmount);

    expect(account.getBalance()).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(initialBalance);
    const withdrawAmount = 50;
    account.withdraw(withdrawAmount);

    expect(account.getBalance()).toBe(initialBalance - withdrawAmount);
  });

  test('should transfer money', () => {
    const transferAmount = 50;
    const account1 = getBankAccount(initialBalance);
    const account2 = getBankAccount(initialBalance2);
    account1.transfer(transferAmount, account2);

    expect(account1.getBalance()).toBe(initialBalance - transferAmount);
    expect(account2.getBalance()).toBe(initialBalance2 + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(initialBalance);
    const balance = await account.fetchBalance();

    if (balance !== null) {
      expect(typeof balance).toBe('number');
    } else {
      expect(balance).toBeNull();
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(initialBalance);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(initialBalance);
    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(initialBalance);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
