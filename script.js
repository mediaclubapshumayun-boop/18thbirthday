// Default seed presents if database is empty
const defaultPresents = [
    {
        sender: "Rebekah",
        message: "You better have a good day!",
        photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300",
        style: "wrap-pink-hearts"
    },
    {
        sender: "Alex",
        message: "Happy Birthday! So glad we get to celebrate with you!",
        photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300",
        style: "wrap-blue-squares"
    }
];

let loadedPresents = [];
let selectedWrapStyle = "wrap-pink-hearts";
let selectedWrapName = "PINK HEARTS";

document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupListeners();
});

function initApp() {
    fetchPresentsFromFirebase();
}

function fetchPresentsFromFirebase() {
    if (window.db) {
        window.db.collection("presents").onSnapshot(snapshot => {
            loadedPresents = [];
            snapshot.forEach(doc => loadedPresents.push(doc.data()));
            if (loadedPresents.length === 0) loadedPresents = defaultPresents;
            renderPresentsInRoom();
        }, () => {
            loadedPresents = defaultPresents;
            renderPresentsInRoom();
        });
    } else {
        loadedPresents = defaultPresents;
        renderPresentsInRoom();
    }
}

function renderPresentsInRoom() {
    const leftContainer = document.getElementById("gifts-left-container");
    const rightContainer = document.getElementById("gifts-right-container");
    
    leftContainer.innerHTML = "";
    rightContainer.innerHTML = "";

    loadedPresents.forEach((gift, index) => {
        const giftEl = document.createElement("div");
        giftEl.className = `gift-item ${gift.style || 'wrap-pink-hearts'}`;
        giftEl.innerText = "🎁";
        giftEl.onclick = () => openPresentModal(gift);

        if (index % 2 === 0) {
            leftContainer.appendChild(giftEl);
        } else {
            rightContainer.appendChild(giftEl);
        }
    });
}

function openPresentModal(gift) {
    document.getElementById("card-sender-name").innerText = gift.sender || "Anonymous";
    document.getElementById("card-letter-text").innerText = gift.message || "Happy Birthday!";
    
    const photoImg = document.getElementById("card-photo-img");
    if (gift.photoUrl) {
        photoImg.src = gift.photoUrl;
        photoImg.parentElement.style.display = "block";
    } else {
        photoImg.parentElement.style.display = "none";
    }

    document.getElementById("view-present-modal").classList.remove("hidden");
}

function setupListeners() {
    // Close View Present Modal
    document.getElementById("close-view-btn").onclick = () => {
        document.getElementById("view-present-modal").classList.add("hidden");
    };
    document.getElementById("close-card-btn").onclick = () => {
        document.getElementById("view-present-modal").classList.add("hidden");
    };

    // Open Leave Present Wrapping Station
    document.getElementById("add-gift-btn").onclick = () => {
        document.getElementById("create-present-modal").classList.remove("hidden");
    };
    document.getElementById("cancel-wrap-btn").onclick = () => {
        document.getElementById("create-present-modal").classList.add("hidden");
    };

    // Select Wrapping Option (Image 2)
    document.querySelectorAll(".wrap-option").forEach(opt => {
        opt.onclick = (e) => {
            document.querySelectorAll(".wrap-option").forEach(o => o.classList.remove("active"));
            e.currentTarget.classList.add("active");
            selectedWrapStyle = e.currentTarget.dataset.style;
            selectedWrapName = e.currentTarget.dataset.name;
            
            document.getElementById("wrap-selected-name").innerText = selectedWrapName;
            document.getElementById("wrap-preview-icon").className = `big-gift-preview ${selectedWrapStyle}`;
        };
    });

    // Submit New Present
    document.getElementById("submit-wrap-btn").onclick = () => {
        const sender = document.getElementById("input-sender").value.trim();
        const message = document.getElementById("input-message").value.trim();
        const photoUrl = document.getElementById("input-photo-url").value.trim();

        if (!message) {
            alert("Please write a message for your present!");
            return;
        }

        const newGift = {
            sender: sender || "A Friend",
            message: message,
            photoUrl: photoUrl || "",
            style: selectedWrapStyle,
            createdAt: new Date().toISOString()
        };

        if (window.db) {
            window.db.collection("presents").add(newGift);
        } else {
            loadedPresents.push(newGift);
            renderPresentsInRoom();
        }

        document.getElementById("create-present-modal").classList.add("hidden");
        // Clear fields
        document.getElementById("input-sender").value = "";
        document.getElementById("input-message").value = "";
        document.getElementById("input-photo-url").value = "";
    };

    // Cake & Candles Interaction
    document.getElementById("cake-trigger").onclick = () => {
        document.getElementById("cake-modal").classList.remove("hidden");
    };
    document.getElementById("close-cake-btn").onclick = () => {
        document.getElementById("cake-modal").classList.add("hidden");
    };
    document.getElementById("blow-candles-btn").onclick = () => {
        document.getElementById("candles-flame").innerText = "💨";
        document.getElementById("cake-modal").classList.add("hidden");
    };

    // Audio Toggle
    document.getElementById("audio-btn").onclick = () => {
        const music = document.getElementById("bg-music");
        if (music.paused) {
            music.play();
            document.getElementById("audio-btn").innerText = "🎵";
        } else {
            music.pause();
            document.getElementById("audio-btn").innerText = "🔇";
        }
    };
}
