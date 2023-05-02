// Calculates the history length subscore given the length of the credit history in months
function calculateHistoryLengthSubscore(historyLengthInMonths: number): number {
    try {
      // Check if the input is valid
      if (typeof historyLengthInMonths !== 'number' || isNaN(historyLengthInMonths)) {
        throw new Error('Invalid input: expected a number representing the length of the credit history in months');
      }
  
      // Determine the subscore based on the length of the credit history
      if (historyLengthInMonths < 12) {
        return 0;
      } else if (historyLengthInMonths < 24) {
        return 15;
      } else if (historyLengthInMonths < 36) {
        return 30;
      } else if (historyLengthInMonths < 48) {
        return 45;
      } else if (historyLengthInMonths < 60) {
        return 60;
      } else if (historyLengthInMonths < 72) {
        return 75;
      } else {
        return 100;
      }
    } catch (error) {
      console.error(error);
      return 0;
    }
  }