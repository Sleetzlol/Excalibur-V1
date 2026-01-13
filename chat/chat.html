// chat.js

let currentUser = null;
let currentConversation = null;

// -----------------------------
// LOGIN CHECK
// -----------------------------
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location = "login.html";
        return;
    }

    currentUser = user;
    loadConversations();
});


// -----------------------------
// LOAD USER CONVERSATIONS
// -----------------------------
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

                let label = data.name;

                // DM NAME FIX
                if (data.type === "dm") {
                    const other = data.memberInfo
                        ? Object.values(data.memberInfo).find(u => u.uid !== currentUser.uid)
                        : null;

                    if (other)
                        label = other.email || "Direct Message";
                }

                div.textContent = label || "Chat";
                div.onclick = () => openConversation(doc.id, data);

                convoList.appendChild(div);
            });
        });
}


// -----------------------------
// OPEN CONVERSATION
// -----------------------------
function openConversation(id, data) {
    currentConversation = id;

    let label = data.name;
    if (data.type === "dm") {
        const other = data.memberInfo
            ? Object.values(data.memberInfo).find(u => u.uid !== currentUser.uid)
            : null;
        if (other) label = other.email;
    }

    document.getElementById("chatHeader").innerText = label || "Chat";
    document.getElementById("msgInput").disabled = false;
    document.getElementById("sendBtn").disabled = false;

    loadMessages();
}


// -----------------------------
// LOAD MESSAGES
// -----------------------------
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


// -----------------------------
// SEND MESSAGE
// -----------------------------
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


// ==========================================================
// STEP A — CREATE DIRECT MESSAGE
// ==========================================================
document.getElementById("startDM").onclick = async () => {
    const email = prompt("Enter Gmail of the user you want to DM:");
    if (!email) return;

    // Find user in Firestore
    const userQuery = await db.collection("users")
        .where("email", "==", email.trim())
        .get();

    if (userQuery.empty) {
        alert("User not found.");
        return;
    }

    const otherUser = userQuery.docs[0].data();
    const otherUID = userQuery.docs[0].id;

    // Check if DM already exists
    const existingDM = await db.collection("conversations")
        .where("type", "==", "dm")
        .where("members", "array-contains", currentUser.uid)
        .get();

    for (const doc of existingDM.docs) {
        const d = doc.data();
        if (d.members.includes(otherUID)) {
            alert("DM already exists, opening it.");
            openConversation(doc.id, d);
            return;
        }
    }

    // Create DM
    await db.collection("conversations").add({
        type: "dm",
        members: [currentUser.uid, otherUID],
        memberInfo: {
            [currentUser.uid]: { uid: currentUser.uid, email: currentUser.email },
            [otherUID]: { uid: otherUID, email: otherUser.email }
        },
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
};


// ==========================================================
// STEP B — ADD MEMBER TO GROUP
// ==========================================================
document.getElementById("addUser").onclick = async () => {
    if (!currentConversation) return alert("Open a group chat first.");

    const email = prompt("Enter Gmail to add to this group:");
    if (!email) return;

    // Lookup user
    const userQuery = await db.collection("users")
        .where("email", "==", email.trim())
        .get();

    if (userQuery.empty) {
        alert("User not found.");
        return;
    }

    const userData = userQuery.docs[0].data();
    const userId = userQuery.docs[0].id;

    // Add user to group
    await db.collection("conversations")
        .doc(currentConversation)
        .update({
            members: firebase.firestore.FieldValue.arrayUnion(userId),
            [`memberInfo.${userId}`]: {
                uid: userId,
                email: userData.email
            }
        });

    alert("User added!");
};


// -----------------------------
// CREATE GROUP CHAT
// -----------------------------
document.getElementById("newGroupBtn").onclick = async () => {
    const name = prompt("Enter group chat name:");
    if (!name) return;

    await db.collection("conversations").add({
        type: "group",
        name: name,
        members: [currentUser.uid],
        memberInfo: {
            [currentUser.uid]: { uid: currentUser.uid, email: currentUser.email }
        },
        createdBy: currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
};


// -----------------------------
// LOGOUT
// -----------------------------
document.getElementById("logoutBtn").onclick = () => auth.signOut();
