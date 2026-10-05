// Firebase Configuration Setup
// Replace with your project details when ready. Works seamlessly in offline/fallback mode if not initialized!
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let db = null;
let userDocRef = null;

try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        // Generate or fetch a unique session key for this person
        let userId = localStorage.getItem('pixel_bday_user_id');
        if (!userId) {
            userId = 'bday_guest_' + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('pixel_bday_user_id', userId);
        }
        userDocRef = db.collection('birthday_progress').doc(userId);
        console.log("🔥 Firebase backend initialized for user:", userId);
    } else {
        console.warn("⚠️ Firebase credentials not set. Running in resilient local session mode.");
    }
} catch (e) {
    console.error("Firebase init failed, switching to local mode:", e);
}

// Global Progress Saver
function saveProgressToFirebase(gameState) {
    if (!userDocRef) return;
    const progressData = {
        giftsOpened: gameState.giftsOpened,
        balloonsPopped: gameState.balloonsPopped,
        heartsCollected: gameState.heartsCollected,
        secretsFound: gameState.secretsFound,
        cakeBlown: gameState.cakeBlown,
        completedMiniGameMemory: gameState.completedMiniGameMemory,
        completedMiniGameScratch: gameState.completedMiniGameScratch,
        isFinaleUnlocked: gameState.isFinaleUnlocked,
        lastUpdated: new Date().toISOString()
    };

    userDocRef.set(progressData, { merge: true })
        .then(() => console.log("☁️ Progress saved to Cloud Firestore!"))
        .catch(err => console.error("Error saving progress:", err));
}
