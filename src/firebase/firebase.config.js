import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyDlxEYMdW7dwBM5iqNdqdCJ495BK2qGw2k",
//   authDomain: "phone-authentication-a7c78.firebaseapp.com",
//   projectId: "phone-authentication-a7c78",
//   storageBucket: "phone-authentication-a7c78.appspot.com",
//   messagingSenderId: "601340221442",
//   appId: "1:601340221442:web:b7b059c137a1e5f31daf1b",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAZrzw_1QM2WXmuLy73kresZGMYMOdNblQ",
  authDomain: "phone-auth-dbc98.firebaseapp.com",
  projectId: "phone-auth-dbc98",
  storageBucket: "phone-auth-dbc98.appspot.com",
  messagingSenderId: "996737856195",
  appId: "1:996737856195:web:b5d7c20e304aa7bce36876",
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
