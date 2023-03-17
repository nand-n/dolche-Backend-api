import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.linear_model import LogisticRegression


dataset=pd.read_excel("./src/Fintech/Equb/ML/e_NewApplications_CreditScore_Needed.xlsx")

# shows count of rows and columns
dataset.shape

#shows first few rows of the code
dataset.head()

#dropping customer ID column from the dataset
dataset=dataset.drop('ID',axis=1)
dataset.shape

# explore missing values
dataset.isna().sum()

# filling missing values with mean
dataset=dataset.fillna(dataset.mean())

# explore missing values post missing value fix
dataset.isna().sum()

X_fresh = dataset

# Loading normalisation coefficients - exported from the model code file as f2_Normalisation 

import joblib

sc = joblib.load('./src/Fintech/Equb/ML/models/f2_Normalisation_CreditScoring')


X_fresh = sc.transform(X_fresh)

# Loading Classifier file - exported from the model code file as f1_Classifier 

classifier = joblib.load('./src/Fintech/Equb/ML/models/f1_Classifier_CreditScoring')

# Generating fresh Target values for new applications

y_fresh = classifier.predict(X_fresh)
y_fresh

# Writing OutPut
predictions = classifier.predict_proba(X_fresh)
predictions

# writing model output file

df_prediction_prob = pd.DataFrame(predictions, columns = ['prob_0', 'prob_1'])
df_prediction_prob


df_test_dataset = pd.DataFrame(X_fresh, columns = dataset.columns)
df_prediction_target = pd.DataFrame(y_fresh,columns= ['Predicted Outcome'])

dfx=pd.concat([df_prediction_target, df_prediction_prob, df_test_dataset], axis=1)

dfx.to_csv("./src/Fintech/Equb/ML/models/f4_NewApplications_CreditScore_Predictions.xlsx", sep=',', encoding='UTF-8')

# dfx.head(10)
dfx.head()
