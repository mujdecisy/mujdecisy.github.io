// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAVw1iVB2Z_qk0B43OB_Q3Fhzu_57LUi5c',
  authDomain: 'mujdecisy-5b7bc.firebaseapp.com',
  projectId: 'mujdecisy-5b7bc',
  storageBucket: 'mujdecisy-5b7bc.appspot.com',
  messagingSenderId: '510162980404',
  appId: '1:510162980404:web:e236e7cd7c3602d6968461',
  measurementId: 'G-BVWXLCDH9E'
};

// Initialize Firebase
export const FIREBASEAPP = initializeApp(firebaseConfig);
export const APPNAME = 'mujdeci-blog';

export function getAnalyticsApp() {
    if (typeof window !== 'undefined') {
        return getAnalytics(FIREBASEAPP);
    } else {
        return null;
    }
}

export function logVisit(pageName) {
    const analyticsApp = getAnalyticsApp();
    if (analyticsApp) {
        logEvent(analyticsApp, 'visit', {
            'app': APPNAME,
            'page': pageName
        });
    }
}