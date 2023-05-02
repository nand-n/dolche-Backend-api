// Calculates the new credit subscore given the number of new credit accounts and the age of the newest account
function  calculateNewCreditSubscore(newCreditAccounts: number, newestAccountAgeMonths: number): number {
    try {
      // Check if the input is valid
      if (
        typeof newCreditAccounts !== 'number' ||
        isNaN(newCreditAccounts) ||
        typeof newestAccountAgeMonths !== 'number' ||
        isNaN(newestAccountAgeMonths)
      ) {
        throw new Error(
          'Invalid input: expected two numbers representing the number of new credit accounts and the age of the newest account'
        );
      }
  
      // Determine the subscore based on the number of new credit accounts and the age of the newest account
      if (newCreditAccounts === 0) {
        return 100;
      } else if (newestAccountAgeMonths <= 2 && newCreditAccounts <= 2) {
        return 95;
      } else if (newestAccountAgeMonths <= 4 && newCreditAccounts <= 4) {
        return 90;
      } else if (newestAccountAgeMonths <= 12 && newCreditAccounts <= 6) {
        return 75;
      } else if (newestAccountAgeMonths <= 24 && newCreditAccounts <= 8) {
        return 50;
      } else if (newestAccountAgeMonths <= 36 && newCreditAccounts <= 10) {
        return 30;
      } else {
        return 0;
      }
    } catch (error) {
      console.error(error);
      return 0;
    }
  }