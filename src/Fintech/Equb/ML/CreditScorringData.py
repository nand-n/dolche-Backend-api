import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.linear_model import LogisticRegression


dataset=pd.read_excel("./src/Fintech/Equb/ML/credit_data.xlsx")

dataset.shape

dataset.head()

dataset=dataset.drop('ID',axis=1)
dataset.shape

dataset.isna().sum()

dataset=dataset.fillna(dataset.mean())

dataset.isna().sum()

y = dataset.iloc[:, 0].values
X = dataset.iloc[:, 1:29].values

X_train, X_test, y_train, y_test = train_test_split(X, y, 
                                                    test_size=0.2, 
                                                    random_state=0,
                                                    stratify=y)


sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

import joblib

# Save the trained model and scaler to the models directory
# joblib.dump(model, 'models/model.pkl')
# joblib.dump(scaler, 'models/scaler.pkl')
joblib.dump(sc, './src/Fintech/Equb/ML/models/f2_Normalisation_CreditScoring')

classifier =  LogisticRegression()
classifier.fit(X_train, y_train)
y_pred = classifier.predict(X_test)

joblib.dump(classifier, './src/Fintech/Equb/ML/models/f1_Classifier_CreditScoring')

print(confusion_matrix(y_test,y_pred))

print(accuracy_score(y_test, y_pred))

predictions = classifier.predict_proba(X_test)
predictions

df_prediction_prob = pd.DataFrame(predictions, columns = ['prob_0', 'prob_1'])
df_prediction_target = pd.DataFrame(classifier.predict(X_test), columns = ['predicted_TARGET'])
df_test_dataset = pd.DataFrame(y_test,columns= ['Actual Outcome'])

dfx=pd.concat([df_test_dataset, df_prediction_prob, df_prediction_target], axis=1)

dfx.to_csv("./src/Fintech/Equb/ML/models/c1_Model_Prediction.xlsx", sep=',', encoding='UTF-8')

dfx.head()