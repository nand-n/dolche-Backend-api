import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import joblib

# Load data
data = pd.read_csv('credit_data.csv')

# Split data into features and target variable
X = data.drop(['credit_risk'], axis=1)
y = data['credit_risk']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train a random forest classifier
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train_scaled, y_train)

# Make predictions on the test set
y_pred = clf.predict(X_test_scaled)

# Evaluate the performance of the model
accuracy = accuracy_score(y_test, y_pred)
confusion = confusion_matrix(y_test, y_pred)
print("Accuracy:", accuracy)
print("Confusion matrix:\n", confusion)

# Save the model for future use
joblib.dump(clf, 'credit_risk_model.joblib')



# This code uses a random forest classifier to predict the credit risk based on the input features. Here's a description of the features used in the model:
# Transaction history: historical data on the borrower's financial transactions (e.g. bank statements)
# Spending habits: data on the borrower's spending behavior (e.g. categories of expenses)
# Credit score: a numerical rating of the borrower's creditworthiness
# Income: the borrower's annual income
# Employment status: the borrower's current employment status (e.g. employed, self-employed, unemployed)
# Debt: the total amount of debt owed by the borrower
# Financial statements: data on the borrower's financial statements (e.g. income statement, balance sheet)
# Collateral: any assets pledged as collateral for the loan
# Loan purpose: the reason for the loan
# Debt-to-income ratio: the borrower's total debt divided by their income