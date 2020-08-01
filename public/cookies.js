function setSession(value) {
    return $.post("/sessions/login", { 'server': value }).then();
}

function getSession() {
    return $.get("/sessions/check").then();
}

function deleteSession() {
    return $.get("/sessions/logout").then();
}