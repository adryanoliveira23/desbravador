import * as admin from "firebase-admin";

const initializeFirebaseAdmin = () => {
  if (
    !admin.apps.length &&
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }
};

// Initialize early if possible
initializeFirebaseAdmin();

const getAdminAuth = () => {
  if (!admin.apps.length) initializeFirebaseAdmin();
  return admin.auth();
};

const getAdminDb = () => {
  if (!admin.apps.length) initializeFirebaseAdmin();
  return admin.firestore();
};

// Exporting proxies to maintain the current API while delaying the actual Firebase call until used.
// This prevents the "FirebaseAppError: The default Firebase app does not exist" during build/import.

export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get: (target, prop) => {
    const instance = getAdminAuth();
    const value = instance[prop as keyof admin.auth.Auth];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(instance)
      : value;
  },
});

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get: (target, prop) => {
    const instance = getAdminDb();
    const value = instance[prop as keyof admin.firestore.Firestore];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(instance)
      : value;
  },
});

export { admin as default };
