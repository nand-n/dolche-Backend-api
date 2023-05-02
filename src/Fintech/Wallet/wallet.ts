
import { Router } from 'express';
import { createLoan, getLoanById } from './Transaction/FinancialServices/CreditAccess/creditAcccess';
import { creditLimit } from './Transaction/FinancialServices/CreditAccess/creditLimit';
import { SendMoney } from './Transaction/SendMoney/SendMoney';
import { P2PTransaction, transactionHistory } from './Transaction/Transaction/transaction';
import { Withdraw } from './Transaction/Withdraw/withdraw';
import { Deposite, DepositeWithEvent } from './Transaction/Deposite/deposite';
import { Balance } from './Info/Balance';
import { depositeApproval } from './Transaction/Deposite/depositeAproval';
import { userDepositeByAgent } from './Transaction/Deposite/depositeByAgent';
import { WithdrawWithEvent } from './Transaction/Withdraw/WithdrawIniciate';
import { WithdrawApproval } from './Transaction/Withdraw/WithdrawAproval';

const routerWallet = Router()
routerWallet.post('/withdraw',Withdraw )

routerWallet.post('/transactionHistory',transactionHistory)
routerWallet.post('/balance',Balance)


routerWallet.post('/deposite',Deposite )
routerWallet.post('/DepositeWithEvent',DepositeWithEvent )
routerWallet.post('/depositeApproval',depositeApproval )
routerWallet.post('/userDepositeByAgent',userDepositeByAgent )
routerWallet.post('/WithdrawWithEvent',WithdrawWithEvent )
routerWallet.post('/WithdrawApproval',WithdrawApproval )


routerWallet.post('/p2ptransaction', P2PTransaction )
routerWallet.post('/cedit-limit', creditLimit)
routerWallet.post('/cedit-access', createLoan)
routerWallet.post('/cedit-detail', getLoanById)

//sendMoney
routerWallet.post('/send-money',SendMoney)

export default routerWallet