// Example scenario: calculate credit mix subscore for a borrower with 3 credit accounts
const creditMix = {
    numCreditAccounts: 3,
    creditAccountTypes: ['credit card', 'mortgage', 'auto loan'],
  };
  const creditMixSubscore = this.calculateCreditMixSubscore(creditMix);
// Calculates the credit mix subscore given the types of credit accounts in the credit mix
function calculateCreditMixSubscore(creditMix): number {
    try {
      // Check if the input is valid
      if (
        !creditMix ||
        typeof creditMix.numCreditAccounts !== 'number' ||
        isNaN(creditMix.numCreditAccounts) ||
        !Array.isArray(creditMix.creditAccountTypes)
      ) {
        throw new Error('Invalid input: expected an object containing the number of credit accounts and an array of credit account types');
      }
  
      const { numCreditAccounts, creditAccountTypes } = creditMix;
  
      // Determine the subscore based on the types of credit accounts in the credit mix
      const numCreditTypes = creditAccountTypes.length;
      if (numCreditAccounts === 0) {
        return 0;
      } else if (numCreditTypes === 1) {
        return 10;
      } else if (numCreditTypes === 2) {
        return 15;
      } else if (numCreditTypes === 3) {
        return 20;
      } else if (numCreditTypes >= 4) {
        return 25;
      } else {
        return 0;
      }
    } catch (error) {
      console.error(error);
      return 0;
    }
  }