const XlsxPopulate = require('xlsx-populate');
const xlsx = require('xlsx');

export const DataGenerator = async (req, res) => {
    const {userId,name,age,gender,education,employment_status,Anualincome,debt,creditScore,creditPurpuse} =req.body
    try {
    // Create a new workbook
    const workbook = await XlsxPopulate.fromBlankAsync();

    // Get the active sheet
    const sheet = workbook.sheet(0);

    // Add headers to the sheet
    const headers = ['name','age', 'gender', 'education', 'employment', 'income', 'debt', 'credit_score', 'creditPurpuse'];
    headers.forEach((header, i) => {
      sheet.cell(1, i + 1).value(header);
    });

    // Add data to the sheet
    const data = [
    //   [30, 'Male', "High School", 'Employed', 40000, 5000, 700, 'High risk'],
    //   [35, 'Female', "Bachelor's", 'Employed', 60000, 2000, 800, 'Low risk'],
    //   [25, 'Male', "Master's", 'Unemployed', 0, 1000, 600, 'High risk'],
    //   [40, 'Female', "Bachelor's", 'Employed', 80000, 0, 900, 'Low risk'],
    //   [45, 'Male', "High School", 'Self-employed', 50000, 10000, 650, 'High risk']
      // Add more rows here as needed
        
    // use the userId and the fetch name gender , creditscore 
        
    //transaction history analysis => catagorize bar, good ,exelent  based on the transaction 
    
        [userId, name, age, gender, education, employment_status, Anualincome, debt, creditScore, creditPurpuse],
        
    ];
    data.forEach((row, i) => {
      row.forEach((value, j) => {
        sheet.cell(i + 2, j + 1).value(value);
      });
    });

    // Write the workbook to a file and send it as a response
    await workbook.toFileAsync('credit_data.xlsx');
    res.download('credit_data.xlsx');
  } catch (error) {
    console.error(error);
        return res.status(500).json({ ErrorMessage:`Error with internal server or ${error.message}`});
  }
}


export const DataGeneratorXlsx = async (req, res) => {
     try {
    const { transaction_history, spending_habit, credit_score, income, employment_status, debt, financial_statements, collateral, loan_purpose, debt_to_income_ratio } = req.body;

    // Create a new workbook
    const workbook = xlsx.utils.book_new();

    // Create a new worksheet
    const worksheet = xlsx.utils.json_to_sheet([{ 
      transaction_history,
      spending_habit,
      credit_score,
      income,
      employment_status,
      debt,
      financial_statements,
      collateral,
      loan_purpose,
      debt_to_income_ratio,
      credit_risk: '',
    }]);

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Credit Data');

    // Write the workbook to a buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set the response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=credit_data.xlsx');

    // Send the buffer as a response
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating credit data');
  }
}

//To add data on the existing exel data 
export const DataGeneratorXlsxAdd = async (req, res) => {
    try {
    const { transaction_history, spending_habit, credit_score, income, employment_status, debt, financial_statements, collateral, loan_purpose, debt_to_income_ratio } = req.body;

    // Load the existing workbook
    const workbook = xlsx.readFile('credit_data.xlsx');

    // Get the first worksheet
    const worksheet = workbook.Sheets['Credit Data'];

    // Get the last row number
    const lastRow = worksheet['!ref'].split(':')[1].slice(1);

    // Add the new row to the worksheet
    worksheet[`A${parseInt(lastRow) + 1}`] = { v: transaction_history };
    worksheet[`B${parseInt(lastRow) + 1}`] = { v: spending_habit };
    worksheet[`C${parseInt(lastRow) + 1}`] = { v: credit_score };
    worksheet[`D${parseInt(lastRow) + 1}`] = { v: income };
    worksheet[`E${parseInt(lastRow) + 1}`] = { v: employment_status };
    worksheet[`F${parseInt(lastRow) + 1}`] = { v: debt };
    worksheet[`G${parseInt(lastRow) + 1}`] = { v: financial_statements };
    worksheet[`H${parseInt(lastRow) + 1}`] = { v: collateral };
    worksheet[`I${parseInt(lastRow) + 1}`] = { v: loan_purpose };
    worksheet[`J${parseInt(lastRow) + 1}`] = { v: debt_to_income_ratio };
    worksheet[`K${parseInt(lastRow) + 1}`] = { v: '' };

    // Write the workbook to a file
   const creditData=  xlsx.writeFile(workbook, 'credit_data.xlsx');

    // res.send('Credit data added successfully');
      
        res.status(200).json({Message:"Credit Data Added Successfully  "}).download(creditData)
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding credit data');
  }
}