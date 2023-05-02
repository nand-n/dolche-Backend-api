// private calculatePaymentHistorySubscore(paymentHistory: boolean[]): number {
function  calculatePaymentHistorySubscore(paymentHistory: boolean[]): number {
    // Count the number of on-time payments and missed payments
    const onTimePayments = paymentHistory.filter((isOnTime) => isOnTime).length;
    const missedPayments = paymentHistory.length - onTimePayments;
  
    // Calculate the percentage of on-time payments and missed payments
    const onTimePercentage = onTimePayments / paymentHistory.length;
    const missedPercentage = missedPayments / paymentHistory.length;
  
    // Apply the FICO 10 T formula to calculate the subscore
    let subscore = 0;
    if (missedPercentage === 0) {
      subscore = 100;
    } else if (missedPercentage <= 0.01) {
      subscore = 95;
    } else if (missedPercentage <= 0.02) {
      subscore = 90;
    } else if (missedPercentage <= 0.03) {
      subscore = 85;
    } else if (missedPercentage <= 0.04) {
      subscore = 80;
    } else if (missedPercentage <= 0.05) {
      subscore = 75;
    } else if (missedPercentage <= 0.06) {
      subscore = 70;
    } else if (missedPercentage <= 0.07) {
      subscore = 65;
    } else if (missedPercentage <= 0.08) {
      subscore = 60;
    } else if (missedPercentage <= 0.09) {
      subscore = 55;
    } else if (missedPercentage <= 0.10) {
      subscore = 50;
    } else if (missedPercentage <= 0.11) {
      subscore = 45;
    } else if (missedPercentage <= 0.12) {
      subscore = 40;
    } else if (missedPercentage <= 0.13) {
      subscore = 35;
    } else if (missedPercentage <= 0.14) {
      subscore = 30;
    } else if (missedPercentage <= 0.15) {
      subscore = 25;
    } else if (missedPercentage <= 0.16) {
      subscore = 20;
    } else if (missedPercentage <= 0.17) {
      subscore = 15;
    } else if (missedPercentage <= 0.18) {
      subscore = 10;
    } else if (missedPercentage <= 0.19) {
      subscore = 5;
    }
  
    return subscore;
  }


  //DB SCHEMA
//   model PaymentHistory {
//     id       Int     @id @default(autoincrement())
//     accountId Int
//     latePayments Int
//     missedPayments Int
//     defaults Int
//     // add more fields as needed
//   } 

