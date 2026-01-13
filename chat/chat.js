// chat.js

let currentUser = null;
let currentConversation = null;

// Wait for login
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location = "login.html";
        return;
    }

    currentUser = user;
    loadConversations();
});


// --------------------------------------------------
// LOAD USER'S CONVERSATIONS (GROUPS & DMS)
// --------------------------------------------------
function loadConversations() {
    const convoList = document.getElementById("conversationList");
    convoList.innerHTML = "";

    db.collection("conversations")
        .where("members", "array-contains", currentUser.uid)
        .orderBy("createdAt", "desc")
        .onSnapshot(snapshot => {
            convoList.innerHTML = "";

            snapshot.forEach(doc => {
                const data = doc.data();

                const div = document.createElement("div");
                div.className = "convo-item";
                div.textContent = data.name || "Unnamed Chat";

                div.onclick = () => openConversation(doc.id, data);
                convoList.appendChild(div);
            });
        });

}



// --------------------------------------------------
// OPEN A CONVERSATION
// --------------------------------------------------
function openConversation(id, data) {
    currentConversation = id;

    document.getElementById("chatHeader").innerText = data.name || "Chat";
    document.getElementById("msgInput").disabled = false;
    document.getElementById("sendBtn").disabled = false;

    loadMessages();
}



// --------------------------------------------------
// LOAD MESSAGES LIVE
// --------------------------------------------------
function loadMessages() {
    const container = document.getElementById("messages");
    container.innerHTML = "";

    db.collection("conversations")
        .doc(currentConversation)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot(snapshot => {
            container.innerHTML = "";

            snapshot.forEach(doc => {
                const msg = doc.data();

                const div = document.createElement("div");
                div.className = "message";
                if (msg.uid === currentUser.uid) {
                    div.classList.add("self");
                }

                div.textContent = msg.text;
                container.appendChild(div);
            });

            container.scrollTop = container.scrollHeight;
        });
}



// --------------------------------------------------
// SEND MESSAGE
// --------------------------------------------------
document.getElementById("sendBtn").onclick = async () => {
    const input = document.getElementById("msgInput");
    if (!currentConversation || input.value.trim() === "") return;

    await db.collection("conversations")
        .doc(currentConversation)
        .collection("messages")
        .add({
            uid: currentUser.uid,
            text: input.value.trim(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

    input.value = "";
};



// --------------------------------------------------
// CREATE GROUP CHAT (FIXED!)
// --------------------------------------------------
document.getElementById("newGroupBtn").onclick = async () => {
    const name = prompt("Enter group chat name:");
    if (!name) return;

    await db.collection("conversations").add({
        type: "group",
        name: name,
        members: [currentUser.uid], // REQUIRED — FIXES AUTO-DELETE
        createdBy: currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
};



// --------------------------------------------------
// LOGOUT
// --------------------------------------------------
document.getElementById("logoutBtn").onclick = () => auth.signOut();
