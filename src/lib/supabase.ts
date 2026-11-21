import { FirebaseDataService } from './firebase';

export const isSupabaseConfigured = true;

// Unified DataService backed by Google Cloud Firebase Firestore & Auth
export const DataService = FirebaseDataService;

export default DataService;
