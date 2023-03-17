import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import joblib

# Load the model
model = joblib.load('credit_risk_model.joblib')

# Create a hypothetical borrower with the following features:
transaction_history = [500, 1000, 1500, 2000, 2500]
spending_habits = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Other']
credit_score = 650
income = 40000
employment_status = 'Employed'
debt = 20000
financial_statements = ['Income Statement', 'Balance Sheet']
collateral = ''
loan_purpose = 'Car'
debt_to_income_ratio = 0.5

# Preprocess the features
borrower = pd.DataFrame({'transaction_history': [transaction_history],
                         'spending_habits': [spending_habits],
                         'credit_score': [credit_score],
                         'income': [income],
                         'employment_status': [employment_status],
                         'debt': [debt],
                         'financial_statements': [financial_statements],
                         'collateral': [collateral],
                         'loan_purpose': [loan_purpose],
                         'debt_to_income_ratio': [debt_to_income_ratio]})

# Standardize the features
# scaler=StandardScaler() 
borrower_scaled = scaler.transform(borrower)

# Make a prediction
prediction = model.predict(borrower_scaled)[0]

print("Prediction:", prediction)