function loadJSON(path, success, error) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000)
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function GetLapTimes() {
    const txnID = document.getElementById("txnID").value
    loadJSON('https://game-session-api.revvracing.com/v1.0/game/result/' + txnID,
        function (data) {
            const lapTimeResults = document.getElementById("lapTimeResults")
            lapTimeResults.innerHTML = ''

            const table = document.createElement("table")
            const trackInfo = table.insertRow()
            const trackName  = trackInfo.insertCell()
            trackName.innerText = "Track: " + data.trackId
            const lapCount = trackInfo.insertCell()
            lapCount.innerText = "Laps: " + data.lapCount

            for (let p in data.result[Object.keys(data.result)[0]].laps) {
                let results = data.result[Object.keys(data.result)[0]].laps[p]
                const lapRow = table.insertRow()
                const lapTitleCell = lapRow.insertCell()
                const lapNumber = parseInt(p) + 1
                lapTitleCell.innerText = "Lap " + lapNumber

                const lapTimeCell = lapRow.insertCell()
                lapTimeCell.innerText = millisToMinutesAndSeconds(results.time)
                for (let x in results.sectors) {
                    const sectorRow = table.insertRow()
                    const sectorTitleCell = sectorRow.insertCell()
                    const sectorNumber = parseInt(x) + 1
                    sectorTitleCell.innerText = "Sector " + sectorNumber

                    const sectorTimeCell = sectorRow.insertCell()
                    sectorTimeCell.innerText = results.sectors[x] / 1000
                }
            }
            
            lapTimeResults.appendChild(table)

        },
        function (xhr) { console.error(xhr); }
    );
}

function AddLapTimeFields() {
    if (document.getElementsByClassName("REVVLapTimes").length == 0) {
        const landingPage = document.getElementById("landing-page")
        const form = document.createElement("form")
        form.className = "REVVLapTimes"
        let labelLapTimes = document.createElement("label")
        labelLapTimes.htmlFor = "txnID"
        labelLapTimes.innerText = "Transaction ID: "
        form.appendChild(labelLapTimes)

        const txnIDInput = document.createElement("input")
        txnIDInput.type = "text"
        txnIDInput.id = "txnID"
        txnIDInput.name = "Transaction ID"
        form.appendChild(txnIDInput)

        const findTimes = document.createElement("input")
        findTimes.type = "button"
        findTimes.value = "Find Times"
        findTimes.onclick = GetLapTimes
        form.appendChild(findTimes)

        form.appendChild(document.createElement("br"))

        form.style = `
            width: 50%;
            display: inline-grid;
        `

        const lapTimeResults = document.createElement("div")
        lapTimeResults.id = "lapTimeResults"
        lapTimeResults.style= `width: 50%;`

        landingPage.insertBefore(lapTimeResults, landingPage.firstChild)
        landingPage.insertBefore(form, landingPage.firstChild)
    }
}

(function () {
    if (document.getElementsByClassName("GetLapTimes").length == 0) {
        // just place a div at top right
        const getLapTimes = document.createElement('a');
        getLapTimes.textContent = 'Get Lap Times';
        getLapTimes.className = "nav-link new GetLapTimes"
        getLapTimes.onclick = AddLapTimeFields
        document.getElementsByClassName("navbar-nav")[0].appendChild(getLapTimes);
        const tableStyle = document.createElement('style');
        tableStyle.textContent = `table, th, td {
            border: 1px solid;
          }
          table{
              width: 100%;
          }
          `;
        document.head.append(tableStyle);
    }
})();