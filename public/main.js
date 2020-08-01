var serverName;


$(document).ready(function() {
    // Make sure we have a valid session
    getSession().then(function(result) {
        serverName = result;
        $("#serName").append(serverName);
        if (!serverName) {
            // If not, send to home
            location.href = '/';
        } else {
            // Get's latest data from this counter
            fetch("/poll")
                .then((res) => res.json())
                .then((data) => {
                    const votes = data.votes;
                    let dataPoints = votes.map(
                        obj => {
                            return {
                                "x": new Date(obj.time),
                                "y": obj.total,
                            }
                        }
                    );
                    var totalVotes = dataPoints[Object.keys(dataPoints).sort((a, b) => b.x - a.x).pop()].y;
                    const chartContainer = document.querySelector("#chartContainer");
                    // Creates the chart with all our data
                    if (chartContainer) {
                        const chart = new CanvasJS.Chart("chartContainer", {
                            animationEnabled: true,
                            zoomEnabled: true,
                            theme: "dark1",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            title: {
                                text: `Current Count ${totalVotes}`,
                                fontFamily: "Montserrat",
                                fontSize: 40,
                            },
                            axisX: {
                                title: "Time",
                                fontFamily: "Montserrat",
                                fontSize: 20,

                            },
                            axisY: {
                                title: "People",
                                fontFamily: "Montserrat",
                                fontSize: 20,

                            },
                            data: [{
                                type: "area",
                                dataPoints: dataPoints,
                            }, ],
                        });
                        chart.render();
                        // Connects to pusher, pretty much a web socket
                        var pusher = new Pusher("e8bd22ca9d4338e305fe", {
                            cluster: "us2",
                        });
                        pusher.connection.bind('error', function(error) {
                            location.reload();
                        });
                        // Channel is the server name
                        var channel = pusher.subscribe("counter-" + serverName);
                        channel.bind("counter-vote", function(data) {
                            totalVotes = data.total;
                            let newPoint = {
                                "x": new Date(data.time),
                                "y": data.total,
                            }
                            dataPoints.push(newPoint);
                            chart.options.title.text = `Current Count ${totalVotes}`;
                            chart.render();
                        });
                    }
                });
        }
    });
});
// Actual counter form
const form = document.getElementById("count-form");
// Form submit
form.addEventListener("click", (e) => {
    const choice = type;
    const acc = (choice == 'add') ? 1 : -1;
    const data = {
        button: choice,
        result: acc,
        server: serverName
    };
    fetch("/poll", {
            method: "post",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        })
        .then((res) => res.json())
        .catch((err) => console.log(err));
    e.preventDefault();
});