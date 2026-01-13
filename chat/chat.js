// chat.js

let currentUser = null;
let currentConversation = null;

// Check authentication
auth.onAuthStateChanged(async user => {
    if (!user) {
        window.location = "login.html";
        return;
    }

    currentUser = user;
    loadConversations();
});

// Load list of chats (DMs + groups)
async function loadConversations() {
    const convoList = document.getElementById("conversationList");
    convoList.innerHTML = "";

    db.collection("conversations")
        .where("members", "array-contains", currentUser.uid)
        .onSnapshot(snapshot => {
            convoList.innerHTML = "";

            snapshot.forEach(doc => {
                const data = doc.data();
                const div = document.createElement("div");
                div.className = "convo-item";
                div.innerText = data.name || "Unnamed Chat";
                div.onclick = () => openConversation(doc.id, data);
                convoList.appendChild(div);
            });
        });
}

// Open a conversation
function openConversation(id, data) {
    currentConversation = id;

    document.getElementById("chatHeader").innerText = data.name;
    document.getElementById("msgInput").disabled = false;
    document.getElementById("sendBtn").disabled = false;

    loadMessages();
}

// Load messages live
function loadMessages() {
    const container = document.getElementById("messages");
    container.innerHTML = "";

    db.collection("conversations")
        .doc(currentConversation)
        .collection("messages")
        .orderBy("timestamp")
        .onSnapshot(snapshot => {
            container.innerHTML = "";

            snapshot.forEach(doc => {
                const msg = doc.data();
                const div = document.createElement("div");
                div.className = "message";

                if (msg.uid === currentUser.uid) div.classList.add("self");

                div.innerText = msg.text;
                container.appendChild(div);
            });

            container.scrollTop = container.scrollHeight;
        });
}

// Send message
document.getElementById("sendBtn").onclick = async () => {
    const input = document.getElementById("msgInput");

    if (input.value.trim() === "" || !currentConversation) return;

    await db.collection("conversations")
        .doc(currentConversation)
        .collection("messages")
        .add({
            uid: currentUser.uid,
            text: input.value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

    input.value = "";
};

// Create group
document.getElementById("newGroupBtn").onclick = async () => {
    const name = prompt("Enter group chat name:");
    if (!name) return;

    await db.collection("conversations").add({
        type: "group",
        name: name,
        members: [currentUser.uid],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
};

// Logout
document.getElementById("logoutBtn").onclick = () => auth.signOut();
