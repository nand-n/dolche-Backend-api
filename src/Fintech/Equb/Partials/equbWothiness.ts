
import { spawn } from 'child_process'
import router from '../../../router';
import multer from 'multer'
import fs from'fs'
import { PythonShell } from 'python-shell';

//Equb Worthiness of The User Based on the Transaction history, credit score ,Asset, Income , Credit Utelization and other factors 


//Equb Worthiness of Dataset Train  
export const equbWorthinesssTrainDataset = async (req, res) => {
  
  try {
    
  const options = {
    pythonPath: '/usr/bin/python3',
    pythonOptions: ['-u'], // get print results in real-time
    // scriptPath: 'path/to/my/scripts',
    scriptPath: './src/Fintech/Equb/ML/',
    args: ['value1', 'value2', 'value3']
};

    const pythonRun =await PythonShell.run('CreditScorringData.py', options)
    if (!pythonRun) {
      return res.status(400).json({message:"Erro for running the python , try again!"})
    }
    res.status(200).json({ Training_Acurracy: `${pythonRun[2]*100}%`, DataSetRowAndColum:  pythonRun[0] ,DataSetRowAndColumn:pythonRun[1]  })
  } catch (error) {
    return res.status(500).json({ ErrorMessage: `Error with internal server ior ${error.message}`})
    // process.exit()
  }
}

//Equb Worthiness of a user based on the trained data
export const creditWorthiness = async (req, res) => {
  try {
    const options = {
    pythonPath: '/usr/bin/python3',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './src/Fintech/Equb/ML/',
    args: ['value1', 'value2', 'value3']
};

    const pythonRun =await PythonShell.run('CreditScoringForNewCustomers.py', options)
    if (!pythonRun) {
      return res.status(400).json({message:"Erro for running the python , try again!"})
    }
    res.status(200).json({ Trainined_Data: pythonRun.length})
  } catch (error) {
    return res.status(500).json({ErrorMessage:`Error with internal server or ${error.message}`})
  }
}

