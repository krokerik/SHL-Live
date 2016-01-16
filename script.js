/*
 * Gets data from the SHL API, interprets it and updates the website DOM-tree 
 */

// var token is defined in index.php

var baseUrl = "http://krokerik.com/SHL/SHL_Proxy.php";
var teams = Array();
var games = Array();
window.onload = function () {
    getStandings(2015);
    getGames(2015);
};

function updateList(standings) {
    console.log(standings);
    var len = standings["length"];
    if (len > 0) {
        var liveTable = document.getElementById("liveTable");
        while (liveTable.lastChild)
            liveTable.removeChild(liveTable.lastChild);
        for (var i = 0; i < len; i++) {
            var row = getRowFromStanding(standings[i]);
            liveTable.appendChild(row);
        }
    }
}
function updateGames(gamesArray) {
    if (gamesArray.length > 0) {
        var clone = Array();
        for (var i = 0; i < teams.length; i++) {
            clone.push(teams[i]["team_code"]);
        }
        gamesArray.reverse();
        var today = new Date(new Date().toDateString());
        var tmp = Array();
        for (var i = 0; i < gamesArray.length; i++) {
            var date = new Date(gamesArray[i]["start_date_time"]);
            if (date.getTime() > today.getTime())
                tmp.push(gamesArray[i]);
        }
        gamesArray = tmp;

        for (var i = 0; i < gamesArray.length; i++) {
            var home = clone.indexOf(gamesArray[i]["home_team_code"]);
            var away = clone.indexOf(gamesArray[i]["away_team_code"]);
            if (home === -1 && away === -1) {
                gamesArray.splice(i, 1);
                i--;
            } else if (home === -1 && away >= 0) {
                clone.splice(away, 1);
            } else if (home >= 0 && away === -1) {
                clone.splice(home, 1);
            } else if (home >= 0 && away >= 0) {
                clone.splice(home, 1);
                away = clone.indexOf(gamesArray[i]["away_team_code"]);
                clone.splice(away, 1);
            }
        }
        console.log(gamesArray);
        var gamesDiv = document.getElementById("games");
        while (gamesDiv.lastChild)
            gamesDiv.removeChild(gamesDiv.lastChild);
        games = Array();
        for (var i = 0; i < gamesArray.length; i++) {
            getGame(gamesArray[i]["season"], gamesArray[i]["game_id"]);

        }
    }
}
function getRowFromStanding(team) {
    var row = document.createElement("TR");
    var rank = document.createElement("TD");
    var name = document.createElement("TD");
    var gp = document.createElement("TD");
    var gd = document.createElement("TD");
    var points = document.createElement("TD");
    var trending = document.createElement("TD");

    rank.innerHTML = team["rank"];
    name.innerHTML = team["team"]["code"];
    gp.innerHTML = team["gp"];
    gd.innerHTML = team["diff"];
    points.innerHTML = team["points"];
    trending.innerHTML = "-";

    row.appendChild(rank);
    row.appendChild(name);
    row.appendChild(gp);
    row.appendChild(gd);
    row.appendChild(points);
    row.appendChild(trending);

    return row;
}
function getGameFromJson(game) {
    var gameDiv = document.createElement("DIV");
    var dateSpan = document.createElement("SPAN");
    var home = document.createElement("SPAN");
    var away = document.createElement("SPAN");
    var time = document.createElement("SPAN");
    var date = new Date(game["start_date_time"]);

    gameDiv.className = "game";
    home.className = "home";
    home.innerHTML = getTeamByID(game["home_team_code"])["team"]["code"] + "<span class=\"result\">" + game["home_team_result"] + "</span>";
    away.className = "away";
    away.innerHTML = getTeamByID(game["away_team_code"])["team"]["code"] + "<span class=\"result\">" + game["away_team_result"] + "</span>";
    dateSpan.className = "date";
    dateSpan.innerHTML = date.toDateString().slice(0, date.toDateString().length - 5);
    time.className = "time";
    time.innerHTML = date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2);

    gameDiv.appendChild(dateSpan);
    gameDiv.appendChild(home);
    gameDiv.appendChild(away);
    gameDiv.appendChild(time);
    return gameDiv;
}
function getStandings(year) {
    var url = baseUrl + "?token=" + token + "&action=standings&year=" + year;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            var tmp = JSON.parse(xmlhttp.responseText);
            updateList(JSON.parse(xmlhttp.responseText));
            teams = Array();
            for (var i = 0; i < tmp.length; i++)
                teams.push(tmp[i]);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function getGames(year) {
    var url = baseUrl + "?token=" + token + "&action=games&year=" + year;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            updateGames(JSON.parse(xmlhttp.responseText));
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function getGame(year, gameID) {
    var url = baseUrl + "?token=" + token + "&action=game&year=" + year + "&gameid=" + gameID;
    console.log(url);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            addGame(JSON.parse(xmlhttp.responseText));
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function addGame(game) {
    games.push(game);
    var gamesDiv = document.getElementById("games");
    gamesDiv.appendChild(getGameFromJson(game));
}
function getTeams() {
    var url = baseUrl + "?token=" + token + "&action=teams";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            var tmp = JSON.parse(xmlhttp.responseText);
            teams = Array();
            for (var i = 0; i < tmp.length; i++) {
                teams.push();
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function getTeam(teamID) {
    var url = baseUrl + "?token=" + token + "&action=team&team=" + teamID;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            var tmp = JSON.parse(xmlhttp.responseText);
            teams = Array();
            for (var i = 0; i < tmp.length; i++) {
                teams.push(tmp[i]);
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function getTeamByID(teamID) {
    for (var i = 0; i < teams.length; i++)
        if (teams[i]["team_code"] === teamID)
            return teams[i];
}