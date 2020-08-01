const form = document.getElementById("load-server");
var element = $("#server")[0];

// Makes sure they entered a semantically correct name
$('#server').on('input', function(e) {
    if (!$("#server").is(':invalid')) {
        $('#helper').html("Looks Good!");
    }
    if ($("#server").val() == "") {
        $('#helper').html("Enter a unique name for your counter");

    }
});

// Anytime someone comes to the home we'll make sure they can join any server
$(document).ready(function() {
    deleteSession();
});

// Entering a counter
$("#submit").click(function() {
    const selected_server = document.getElementById("server").value.toLowerCase();
    var re = new RegExp('^[a-zA-Z0-9-]+$');
    if (!re.test(selected_server)) {
        // They should not be able to get here but we'll check
        alert("Invalid Counter Name");
        return;
    }
    const data = {
        server: selected_server,
    };
    // Check if server exists
    fetch("/load", {
            method: "post",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        })
        .then((res) => {
            res.json().then(body => {
                if (!body.exists)
                    location.href = `/create?server=${body.server}`;
                else
                    load_server(body.server);
            });
        })
        .catch((err) => console.log("ERROR" + err));

    e.preventDefault();
});

function load_server(serverName) {
    setSession(serverName).then(function(result) {
        location.href = '/counter';
    });
}