import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

dotenv.config();

// The user can place their firebase service account JSON in this directory or use env variables
const initFirebase = () => {
    try {
        if (!admin.apps.length) {
            // Check if user provided path or env var
            if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
                const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                console.log('Firebase Admin Initialized with service account file.');
            } else {
                console.warn('Firebase Admin NOT initialized! FIREBASE_SERVICE_ACCOUNT_PATH is missing.');
            }
        }
    } catch (error) {
        console.error('Firebase Auth Init Error:', error);
    }
}

initFirebase();

export default admin;
