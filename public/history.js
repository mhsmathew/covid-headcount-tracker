var date;
var groupName;

// Get all our statistics
function getStatistics(votes) {
    // Most amount of people
    $("#mostPeople").append(getMax(votes).total);
    // Hour where most people were at for one time
    $("#bestHour").append((new Date(getMax(votes).time)).toLocaleString('en-US', { hour: 'numeric', hour12: true })).append(" (Easter Time)");
    // Total throughput
    $("#totalPeople").append(totalPeople(votes));
    var arr = votes.filter(function(item) {
        return item.button == "subtract";
    });
    // Hour where most people left
    $("#worstHour").append(getWorstHour(arr)).append(" (Easter Time)");
    var arr = votes.filter(function(item) {
        return item.button == "add";
    });
    // Hour where most people arrived
    $("#bestHour2").append(getWorstHour(arr)).append(" (Easter Time)");



}

function getMax(arr) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if (max == null || parseInt(arr[i].total) > parseInt(max.total))
            max = arr[i];
    }
    return max;
}

function totalPeople(arr) {
    count = 0;
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i].total < arr[i + 1].total) {
            count++;
        }
    }
    return count;
}

function getWorstHour(arr) {
    let dataPoints = arr.map(
        obj => {
            return {
                "time": new Date(obj.time).toLocaleString('en-US', { hour: 'numeric', hour12: true }),
                "total": obj.total,
                "type": obj.button
            }
        }
    );
    var groups = dataPoints.map(value => { return value["time"] });
    var group_count = {};
    groups.forEach(function(value, index) {
        if (value in group_count) {
            group_count[value] += 1;
        } else {
            group_count[value] = 1;
        }
    });
    return getKeysWithHighestValue(group_count);
}

function getKeysWithHighestValue(o) {
    var keys = Object.keys(o);
    keys.sort(function(a, b) {
        return o[b] - o[a];
    })
    console.log(keys);
    return keys[0];
}

$(document).ready(function() {
    let searchParams = new URLSearchParams(window.location.search)
    if (!searchParams.has('group')) {
        $("#serName").html("Error! No counter found.");
        return;
    }
    groupName = searchParams.get('group');
    fetch("/poll/history", {
            method: "post",
            body: JSON.stringify({ group: groupName }),
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        })
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
            try {
                var totalVotes = dataPoints[Object.keys(dataPoints).sort((a, b) => b.x - a.x).pop()].y;
                date = new Date(votes[0].time).toDateString();
                $("#serName").append(date);
            } catch (err) {
                $("#serName").html("Error! No counter found.");
                return;
            }
            getStatistics(votes);
            const chartContainer = document.querySelector("#chartContainer");
            if (chartContainer) {
                const chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    zoomEnabled: true,
                    theme: "dark1",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    title: {
                        text: `Your Counter`,
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
            }
        });
});