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
        let userId = localStorage.getItem('pixel_bday_user_id') || 'bday_guest_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('pixel_bday_user_id', userId);
        userDocRef = db.collection('birthday_progress').doc(userId);
    }
} catch (e) {
    console.warn("Running in local browser storage mode.");
}

function saveProgressToFirebase(gameState) {
    if (!userDocRef) return;
    userDocRef.set({
        giftsOpened: gameState.giftsOpened,
        balloonsPopped: gameState.balloonsPopped,
        heartsCollected: gameState.heartsCollected,
        secretsFound: gameState.secretsFound,
        cakeBlown: gameState.cakeBlown,
        lastUpdated: new Date().toISOString()
    }, { merge: true });
}
