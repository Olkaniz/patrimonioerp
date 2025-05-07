import admin from "firebase-admin";
import serviceAccount from "./firebase-service-account.json"; // nome do seu arquivo baixado

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { db };
