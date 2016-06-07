var baseUrl = window.location.protocol + "//" + window.location.host + "/SHL/SHL_Proxy.php";

var Root = React.createClass({
    render: function (){
        return <div>
            <Container/>
            <Footer/>
        </div>;
    }
});
var Container = React.createClass({
    getGames: function (that,year) {
        var url = baseUrl + "?token=" + token + "&action=games&year=" + year;
        console.log(url);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                console.log(xmlhttp.responseText);
                that.setState({games:xmlhttp.responseText});
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    },
    getInitialState: function () {
        return {games: '{}'};
    },
    render: function () {
        if(this.state.games == '{}')
            this.getGames(this,2015);
        console.log(this.state.games);
        return <div id="container">
            <Table/>
            <PlayOff/>
            <Games/>
            {this.state.games}
        </div>;
    }
});
var Table = React.createClass({
    render: function () {
        return <div id="table">
            <table>
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th><abbr title="Games Played">GP</abbr></th>
                    <th><abbr title="Goal Difference">GD</abbr></th>
                    <th>Points</th>
                    <th>Trend</th>
                </tr>
                </thead>
                <tbody>
                
                </tbody>
            </table>
        </div>
    }
});
var PlayOff = React.createClass({
    render: function () {
        return <div id="playOff">
            <h3>Playoff Tree</h3>
        </div>
    }
});
var Games = React.createClass({
    render: function () {
        return <div id="games">
            <h3>Today's Games:</h3>
        </div>
    }
});
var Footer = React.createClass({
    render: function() {
        return  (<footer>Utvecklad av <a target="_blank" hreflang="en" href="http://erik-andersson.se/">Erik Andersson</a> med hjälp av data tillhandahållen av <a target="_blank" hreflang="sv" href="http://www.shl.se/">SHL.se</a>.</footer>);
    }
});
ReactDOM.render(<Root/>,document.getElementById("root"));