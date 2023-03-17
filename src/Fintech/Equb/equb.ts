import { Router } from 'express';
import multer from 'multer'
import fs from'fs'
import { isUserAdmin } from '../../modules/Admin_Auth';
import { equbActivate } from './Partials/equbActivate';
import { createEqub, equbList } from './Partials/equbList';
import { equbListSelect } from './Partials/equbListSelect';
import { creditWorthiness, equbWorthinesssTrainDataset } from './Partials/equbWothiness';
import { activatedEqubId } from './Partials/activatedEqub';
// import { equbWorthinesss } from './Partials/equbWothiness';

const routerEqub = Router()

//Equb Activation 
routerEqub.post('/equb-activate', equbActivate)
// //Equb Create 
routerEqub.post('/equb-create', createEqub)
// //Equb Lists 
routerEqub.post('/equb-list', equbList)

//activatedEqubId Detail
routerEqub.post('/activated-equb-detail', activatedEqubId)


// //Equb List Select
// routerEqub.post('/equb-list-select', equbListSelect)
 
// //Equb Worthiness for the selected equb type Chacker

//    // Set up Multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // router.post('/equb-worthiness', upload.single('data'), equbWorthinesss)

// //Equb Risk Analysis 
// // router.post('/equb-risk-analysis', equbRiskAnalysis)

// //Equb Credit Score 
// // router.post('/equb-credit-score', equbCreditScore)

// //Equb Legal Documents
// // router.post('/equb-legal-documnet', equbLegalDocument)

// //Equb first Payment
// // router.post('/equbFirstPaymnet',equbFirstPayment)

// //Equb Recuring Paymnet monthly
// // router.post('/equb-recurring-payment', equbRecurringPayment)


// //Credit Worthiness dataset Train
// routerEqub.post('/equb-worthiness-dataset-train', equbWorthinesssTrainDataset)
// //Equb Worthiness of a user based on the ML 
// routerEqub.post('/equb-worthiness',creditWorthiness)

export default routerEqub;