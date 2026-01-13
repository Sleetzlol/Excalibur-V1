// --------------------------------------------------
// FIREBASE AUTH LISTENER
// --------------------------------------------------
let currentUser = null;
let unsubscribeMessages = null;

firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    currentUser = user;
    loadConversations();
});

const db = firebase.firestore();


// --------------------------------------------------
// LOAD CONVERSATIONS FOR SIDEBAR
// --------------------------------------------------
async function loadConversations() {
    const list = document.getElementById("conversationList");
    list.innerHTML = "";

    const snapshot = await db.collection("conversations")
        .where("members", "array-contains", currentUser.uid)
        .orderBy("createdAt", "asc")
        .get();

    snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "conversation-item";
        div.textContent = data.name || "Unnamed Chat";
        div.onclick = () => openConversation(doc.id, data);
        list.appendChild(div);
    });
}


// --------------------------------------------------
// OPEN A CONVERSATION AND LOAD ITS MESSAGES
// --------------------------------------------------
async function openConversation(id, data) {
    document.getElementById("chatHeader").textContent = data.name || "Conversation";
    document.getElementById("msgInput").disabled = false;
    document.getElementById("sendBtn").disabled = false;

    if (unsubscribeMessages) unsubscribeMessages();

    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    unsubscribeMessages = db.collection("conversations")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot(snapshot => {
            messagesDiv.innerHTML = "";
            snapshot.forEach(doc => {
                const msg = doc.data();
                const p = document.createElement("div");
                p.className = msg.sender === currentUser.uid ? "msg-out" : "msg-in";
                p.textContent = msg.text;
                messagesDiv.appendChild(p);
            });
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });

    // Attach send button to this conversation
    document.getElementById("sendBtn").onclick = () => sendMessage(id);
}


// --------------------------------------------------
// SEND MESSAGE
// --------------------------------------------------
async function sendMessage(conversationId) {
    const input = document.getElementById("msgInput");
    const text = input.value.trim();
    if (!text) return;

    input.value = "";

    await db.collection("conversations")
        .doc(conversationId)
        .collection("messages")
        .add({
            text,
            sender: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
}


// --------------------------------------------------
// CREATE A GROUP CHAT
// --------------------------------------------------
document.getElementById("newGroupBtn").onclick = async () => {
    const name = prompt("Group name:");
    if (!name) return;

    const convo = await db.collection("conversations").add({
        type: "group",
        name: name,
        members: [currentUser.uid],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    loadConversations();
};


// --------------------------------------------------
// LOOK UP USER BY EMAIL (GMAIL)
// --------------------------------------------------
async function getUserByEmail(email) {
    const snap = await db.collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

    if (snap.empty) return null;

    const doc = snap.docs[0];
    return { uid: doc.id, ...doc.data() };
}


// --------------------------------------------------
// START DIRECT MESSAGE WITH GMAIL
// (Step 3 – already prepared)
// --------------------------------------------------
async function startDMByEmail() {
    const email = prompt("Enter Gmail of person to DM:");
    if (!email) return;

    const target = await getUserByEmail(email);
    if (!target) {
        alert("No user found with that Gmail.");
        return;
    }

    const targetUid = target.uid;

    // Check if there's already a DM between these two users
    const existing = await db.collection("conversations")
        .where("type", "==", "dm")
        .where("members", "array-contains", currentUser.uid)
        .get();

    let dmId = null;

    existing.forEach(doc => {
        const data = doc.data();
        if (data.members.includes(targetUid)) dmId = doc.id;
    });

    if (dmId) {
        openConversation(dmId, { name: target.name });
        return;
    }

    // Otherwise create a new DM
    const newDM = await db.collection("conversations").add({
        type: "dm",
        members: [currentUser.uid, targetUid],
        name: target.name,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    openConversation(newDM.id, { name: target.name });
}


// Connect DM button
const dmBtn = document.getElementById("startDM");
if (dmBtn) {
    dmBtn.onclick = startDMByEmail;
}


// --------------------------------------------------
// LOG OUT
// --------------------------------------------------
document.getElementById("logoutBtn").onclick = async () => {
    await firebase.auth().signOut();
};
