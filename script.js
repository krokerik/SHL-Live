/*
 * Gets data from the SHL API, interprets it and updates the website DOM-tree 
 */

/* global token, Notification */
/*
 * var token is defined in index.php, Notification is used by various
 * browsers to send notifications.
 */

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
function team(code, gp, gf, ga, p) {
    this.name = code;
    this.gp = gp;
    this.gf = gf;
    this.ga = ga;
    this.p = p;
    this.gd = function () {
        return this.gf - this.ga;
    };
}

var baseUrl = window.location.protocol + "//" + window.location.host + "/SHL/SHL_Proxy.php";
var teams = Array();
var games = Array();
var teamObjects = Array();
var gamesArray = Array();
var played = Array();
var playoff = Array();
var live = Array();
getGames(2015);
window.onload = function () {
    setInterval(updateGamesDiv, 3000);
    setInterval(generateTable, 3000);
};
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function updateGamesDiv() {
    var gamesDiv = document.getElementById("games");
    if(live.length === 0){
        var noGamesHeader = document.createElement("h4");
        noGamesHeader.textContent = "No games today";
        while(gamesDiv.lastChild.tagName !== "H3") {
            gamesDiv.removeChild(gamesDiv.lastChild);
        }
        gamesDiv.appendChild(noGamesHeader);
    } else {
        var secondNode = gamesDiv.firstChild.nextSibling;
        if(secondNode !== null && secondNode.tagName === "H4"){
            gamesDiv.removeChild(secondNode);
        }
        for (var i = 0; i < live.length; i++) {
            addGame(live[i]);
        }
    }
}
function updateGames(gamesArray) {
    gamesArray.reverse();

    for (var i = 0; i < gamesArray.length; i++) {
        var date = new Date(gamesArray[i]["start_date_time"]);
        var today = new Date(new Date().toDateString());
        if (date.getTime() < today.getTime())
            played.push(gamesArray[i]);
        else if (date.toDateString() === today.toDateString()) {
            getGame(2015, gamesArray[i]["game_id"]);
            live.push(gamesArray[i]);
        }
        if (date.getTime() < today.getTime() && gamesArray[i]["game_type"]==="playoff")
            playoff.push(gamesArray[i]);
    }

}
function generateTable() {
    if (played.length > 0) {
        var liveTable = document.getElementById("liveTable");
        var teams = Array();
        var gp = Array();
        var ga = Array();
        var gf = Array();
        var p = Array();
        for (var i = 0; i < played.length; i++) {
            if(played[i]["game_type"]!=="playoff"){
                var home = played[i]["home_team_code"];
                var away = played[i]["away_team_code"];
                if (!teams.contains(home)) {
                    teams.push(home);
                    gp[home] = 0;
                    ga[home] = 0;
                    gf[home] = 0;
                    p[home] = 0;
                }
                if (!teams.contains(away)) {
                    teams.push(away);
                    gp[away] = 0;
                    ga[away] = 0;
                    gf[away] = 0;
                    p[away] = 0;
                }

                gp[away]++;
                gp[home]++;

                gf[away] += played[i]["away_team_result"];
                ga[away] += played[i]["home_team_result"];
                gf[home] += played[i]["home_team_result"];
                ga[home] += played[i]["away_team_result"];

                if (played[i]["overtime"] || played[i]["penalty_shots"]) {
                    if (played[i]["away_team_result"] > played[i]["home_team_result"]) {
                        p[home] += 1;
                        p[away] += 2;
                    } else {
                        p[home] += 2;
                        p[away] += 1;
                    }
                } else {
                    if (played[i]["away_team_result"] > played[i]["home_team_result"]) {
                        p[away] += 3;
                    } else {
                        p[home] += 3;
                    }
                }
            }
        }
        teamObjects = Array();
        for (var i = 0; i < teams.length; i++) {
            teamObjects.push(new team(teams[i], gp[teams[i]], gf[teams[i]], ga[teams[i]], p[teams[i]]));
        }
        var rank = Array();
        var sorted = sortTable(teamObjects);
        for (var i = 0; i < sorted.length; i++) {
            rank[sorted[i].name] = i + 1;
        }
        for (var i = 0; i < live.length; i++) {
            var date = new Date(live[i]["start_date_time"]);
            if (live[i]["live"] !== undefined && live[i]["game_type"]!=="playoff") {
                var home = live[i]["home_team_code"];
                var away = live[i]["away_team_code"];
                if (!teams.contains(home)) {
                    teams.push(home);
                    gp[home] = 0;
                    ga[home] = 0;
                    gf[home] = 0;
                    p[home] = 0;
                }
                if (!teams.contains(away)) {
                    teams.push(away);
                    gp[away] = 0;
                    ga[away] = 0;
                    gf[away] = 0;
                    p[away] = 0;
                }
                gp[away]++;
                gp[home]++;

                gf[away] += live[i]["live"]["away_score"];
                ga[away] += live[i]["live"]["home_score"];
                gf[home] += live[i]["live"]["home_score"];
                ga[home] += live[i]["live"]["away_score"];

                if (live[i]["overtime"] || live[i]["penalty_shots"] || live[i]["live"]["period"]>3) {
                    if (live[i]["live"]["home_score"] > live[i]["live"]["away_score"]) {
                        p[home] += 2;
                        p[away] += 1;
                    } else if (live[i]["live"]["home_score"] === live[i]["live"]["away_score"]) {
                        p[home] += 1;
                        p[away] += 1;
                    } else {
                        p[home] += 1;
                        p[away] += 2;
                    }
                } else {
                    if (live[i]["live"]["home_score"] > live[i]["live"]["away_score"]) {
                        p[home] += 3;
                    } else if (live[i]["live"]["home_score"] === live[i]["live"]["away_score"]) {
                        p[home] += 1;
                        p[away] += 1;
                    } else {
                        p[away] += 3;
                    }
                }
            }
        }
        teamObjects = Array();
        for (var i = 0; i < teams.length; i++) {
            teamObjects.push(new team(teams[i], gp[teams[i]], gf[teams[i]], ga[teams[i]], p[teams[i]]));
        }
        console.log(teamObjects);
        sorted = sortTable(teamObjects);
        while (liveTable.hasChildNodes())
            liveTable.removeChild(liveTable.firstChild);
        for (var i = 0; i < sorted.length; i++) {
            var row = getRowFromArray(sorted[i], i + 1, rank[sorted[i].name] - (i + 1));
            liveTable.appendChild(row);
        }
        if(playoff.length>0){
            generatePlayoff(sorted);
        }
    }
}
function playOffVs(team1, team2){
    var team1Res = 0;
    var team2Res = 0;
for(var i=0; i<playoff.length; i++){
        if((team1 === playoff[i]["home_team_code"] || team1 === playoff[i]["away_team_code"]) && 
            (team2 === playoff[i]["home_team_code"] || team2 === playoff[i]["away_team_code"])) {
            if(playoff[i]["away_team_result"]>playoff[i]["home_team_result"]) {
                if(team1 === playoff[i]["away_team_code"])
                    team1Res++;
                else
                    team2Res++;
            } else {
                if(team1 === playoff[i]["home_team_code"])
                    team1Res++;
                else
                    team2Res++;
            }
        }
    }
        for(var i=0; i<live.length; i++){
        if(live[i]["live"] !== undefined){
            if((team1 === live[i]["home_team_code"] || team1 === live[i]["away_team_code"]) && 
                (team2 === live[i]["home_team_code"] || team2 === live[i]["away_team_code"])) {
                if(live[i]["live"]["away_score"]>live[i]["live"]["home_score"]) {
                    if(team1 === live[i]["away_team_code"])
                        team1Res++;
                    else
                        team2Res++;
                } else if(live[i]["live"]["away_score"]<live[i]["live"]["home_score"]){
                    if(team1 === live[i]["home_team_code"])
                        team1Res++;
                    else
                        team2Res++;
                }
            }
        }
    }
    var winning;
    if(team1Res>team2Res)
        winning = team1;
    else if(team2Res>team1Res)
        winning = team2;
    else
        winning = "TBD";
    return {team1:team1,
            team2:team2,
            team1Res:team1Res, 
            team2Res:team2Res, 
            winning:winning};
}
function getPos(teamArray, team){
    var pos = 0;
    for(var i=0; i<teamArray.length; i++) {
        if(team === teamArray[i]["name"]) {
            pos = i+1;
            break;
        }
    }
    return pos;
}
function generatePlayoff(teamArray) {
    var playOffDiv = document.getElementById("playOff");
    var playIn = new Array(
            playOffVs(teamArray[6]["name"],teamArray[9]["name"]),
            playOffVs(teamArray[7]["name"],teamArray[8]["name"]));
    
    var oldDiv = document.getElementById("Eighth");
    var newDiv = generateRoundDiv("Eighth",playIn);
    if (oldDiv === null)
        playOffDiv.appendChild(newDiv);
    else
        playOffDiv.replaceChild(newDiv, oldDiv);
    
    var playInWinners = sortRoundWinners(teamArray,playIn);
    var quarters = new Array(
                playOffVs(teamArray[0]["name"],playInWinners[1].team),
                playOffVs(teamArray[1]["name"],playInWinners[0].team),
                playOffVs(teamArray[2]["name"],teamArray[5]["name"]),
                playOffVs(teamArray[3]["name"],teamArray[4]["name"]));
                
    oldDiv = document.getElementById("Quarter");
    newDiv = generateRoundDiv("Quarter",quarters);
    if (oldDiv === null)
        playOffDiv.appendChild(newDiv);
    else
        playOffDiv.replaceChild(newDiv, oldDiv);
                
    var quarterWinners = sortRoundWinners(teamArray,quarters);
    var semiFinals = new Array(
                    playOffVs(quarterWinners[0].team,quarterWinners[3].team),
                    playOffVs(quarterWinners[1].team,quarterWinners[2].team));
                    
    oldDiv = document.getElementById("Semi");
    newDiv = generateRoundDiv("Semi",semiFinals);
    if (oldDiv === null)
        playOffDiv.appendChild(newDiv);
    else
        playOffDiv.replaceChild(newDiv, oldDiv);

    var semiFinalWinners = sortRoundWinners(teamArray,semiFinals);
    var final = new Array(playOffVs(semiFinalWinners[0].team,semiFinalWinners[1].team));
    
    oldDiv = document.getElementById("Final");
    newDiv = generateRoundDiv("Final",final);
    if (oldDiv === null)
        playOffDiv.appendChild(newDiv);
    else
        playOffDiv.replaceChild(newDiv, oldDiv);
}
function generateRoundDiv(roundName,matchups) {
    var roundDiv = document.createElement("DIV");
    var title = document.createElement("H4");
    
    title.textContent = roundName;
    
    roundDiv.id = roundName;
    roundDiv.className = "playOffRound";
    roundDiv.appendChild(title);
    
    for(var i = 0; i<matchups.length; i++) {
        var matchup = document.createElement("DIV");
        var team1 = document.createElement("SPAN");
        var team2 = document.createElement("SPAN");
        var team1Res = document.createElement("SPAN");
        var team2Res = document.createElement("SPAN");
        
        matchup.className = "game";
        team1.className = "home";
        team2.className = "away";
        team1Res.className = "result";
        team2Res.className = "result";
        if(matchups[i].team1Res > matchups[i].team2Res)
            team1.className = "winning";
        else if(matchups[i].team1Res < matchups[i].team2Res)
            team2.className = "winning";
        
        team1Res.textContent = matchups[i].team1Res;
        team2Res.textContent = matchups[i].team2Res;
        team1.textContent = matchups[i].team1;
        team2.textContent = matchups[i].team2;
        
        team1.appendChild(team1Res);
        team2.appendChild(team2Res);
        matchup.appendChild(team1);
        matchup.appendChild(team2);
        roundDiv.appendChild(matchup);
    }
    return roundDiv;
}
function sortRoundWinners(teamArray, matchups){
    var winners = new Array();
    for(var i=0; i<matchups.length; i++){
        winners.push({team:matchups[i].winning,
                      rank:getPos(teamArray,matchups[i].winning)});
    }
    var swapped, temp;
    do {
        swapped = false;
        for (var i = 0; i < winners.length - 1; i++) {
            if (winners[i].rank > winners[i + 1].rank) {
                temp = winners[i];
                winners[i] = winners[i + 1];
                winners[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return winners;
}
function sortTable(teamArray) {
    var sorted = teamArray.slice();
    var swapped, temp;
    do {
        swapped = false;
        for (var i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].p < sorted[i + 1].p || (sorted[i].p === sorted[i + 1].p && sorted[i].gd() < sorted[i + 1].gd()) || (sorted[i].p === sorted[i + 1].p && sorted[i].gd() === sorted[i + 1].gd() && sorted[i].gf < sorted[i + 1].gf)) {
                temp = sorted[i];
                sorted[i] = sorted[i + 1];
                sorted[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return sorted;
}
function getRowFromArray(team, rank, trend) {
    var row = document.createElement("TR");
    var rankCell = document.createElement("TD");
    var name = document.createElement("TD");
    var gpCell = document.createElement("TD");
    var gdCell = document.createElement("TD");
    var points = document.createElement("TD");
    var trending = document.createElement("TD");
    var gdAbbr = document.createElement("ABBR");
    
    rankCell.textContent = rank;
    name.textContent = team.name;
    gpCell.textContent = team.gp;
    gdAbbr.textContent = team.gd();
    gdAbbr.title = team.gf+" - "+team.ga;
    gdCell.appendChild(gdAbbr);
    points.textContent = team.p;
    trending.textContent = trend;
    if(trend>1)
        trending.textContent += " ↑";
    else if(trend>0)
        trending.textContent += " ↗";
    else if(trend<-1)
        trending.textContent += " ↓";
    else if(trend<0)
        trending.textContent += " ↘";
    else
        trending.textContent += " →";
    row.appendChild(rankCell);
    row.appendChild(name);
    row.appendChild(gpCell);
    row.appendChild(gdCell);
    row.appendChild(points);
    row.appendChild(trending);

    return row;
}
function startTimer(timeSpan, date) {
    var now = Date.now();
    var time = date.getTime() - now;
    var hours = Math.floor(time / 3600000);
    time -= hours * 3600000;
    var minutes = Math.floor(time / 60000);
    time -= minutes * 60000;
    var seconds = Math.floor(time / 1000);
    timeSpan.innerHTML = ('0' + hours).slice(-2) + ":" + ('0'+minutes).slice(-2) + ":" + ('0'+seconds).slice(-2);
    if (date.getTime() > now) {
        setTimeout(function () {
            startTimer(timeSpan, date);
        }, 1000);
    }
}
function getGameFromJson(game) {
    var gameDiv = document.createElement("DIV");
    var dateSpan = document.createElement("SPAN");
    var home = document.createElement("SPAN");
    var away = document.createElement("SPAN");
    var time = document.createElement("SPAN");
    var date = new Date(game["start_date_time"]);
    if (date.getTime() > Date.now()) {
        startTimer(time, date);
    }
    if (game["live"] !== undefined) {
        gameDiv.className = "game";
        home.className = "home";
        home.innerHTML = game["home_team_code"] + "<span class=\"result\">" + game["live"]["home_score"] + "</span>";
        away.className = "away";
        away.innerHTML = game["away_team_code"] + "<span class=\"result\">" + game["live"]["away_score"] + "</span>";
        time.className = "time";
        time.innerHTML = game["live"]["status_string"];
    } else {
        gameDiv.className = "game";
        home.className = "home";
        home.innerHTML = game["home_team_code"] + "<span class=\"result\">" + game["home_team_result"] + "</span>";
        away.className = "away";
        away.innerHTML = game["away_team_code"] + "<span class=\"result\">" + game["away_team_result"] + "</span>";
        time.className = "time";
        time.innerHTML = date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2);
    }
    dateSpan.className = "date";
    dateSpan.innerHTML = date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2);
    gameDiv.id = game["home_team_code"] + game["away_team_code"];
    gameDiv.appendChild(dateSpan);
    gameDiv.appendChild(home);
    gameDiv.appendChild(away);
    gameDiv.appendChild(time);
    return gameDiv;
}
function getGames(year) {
    var url = baseUrl + "?token=" + token + "&action=games&year=" + year;
    console.log(url);
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
            var game = JSON.parse(xmlhttp.responseText);
            if(game === null){
                getGame(2015,gameID);
            } else {
                updateLiveGame(game);
                if (game["played"] === false) {
                    var now = Date.now();
                    var gameStart = new Date(game["start_date_time"]).getTime();
                    var delay = gameStart > now ? gameStart - now : 15000;
                    setTimeout(function () {
                        getGame(year, gameID);
                    }, delay);
                }
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function addGame(game) {
    var gamesDiv = document.getElementById("games");
    var gameDiv = getGameFromJson(game);
    var oldGame = document.getElementById(game["home_team_code"] + game["away_team_code"]);
    if (oldGame === null)
        gamesDiv.appendChild(gameDiv);
    else if (new Date(game["start_date_time"]).getTime() < Date.now())
        gamesDiv.replaceChild(gameDiv, oldGame);
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
function updateLiveGame(game) {
    for (var i = 0; i < live.length; i++)
        if (live[i]["game_id"] === game["game_id"]){
            var oldHome = live[i]["live"]!==undefined ? live[i]["live"]["home_score"] : live[i]["home_team_result"];
            var oldAway = live[i]["live"]!==undefined ? live[i]["live"]["away_score"] : live[i]["away_team_result"];
            var currHome = game["live"]!==undefined ? game["live"]["home_score"] : game["home_team_result"];
            var currAway = game["live"]!==undefined ? game["live"]["away_score"] : game["away_team_result"];
            var time = game["live"]!==undefined ? game["live"]["status_string"] : game["Over"];
            var scoreLine = game["home_team_code"]+" "+currHome+" - "+currAway+" "+game["away_team_code"]+" at "+time;
            if(oldHome!==currHome)
                notifyGoal(game["home_team_code"],scoreLine);
            if(oldAway!==currAway)
                notifyGoal(game["away_team_code"],scoreLine);
            live[i] = game;
        }
}
function getTeamByID(teamID) {
    for (var i = 0; i < teams.length; i++)
        if (teams[i]["team_code"] === teamID)
            return teams[i];
}
function notifyGoal(team,result) {
  setFavicon("goal.ico");
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification(team+' scored!', {
      icon: "goal.ico",
      body: "Current result is "+result+"!"
    });

    notification.onclick = function () {
      window.focus();
      setFavicon("nogoal.ico");
    };
  }
}
function setFavicon(icon){
    document.getElementById("favicon").href = icon;
}