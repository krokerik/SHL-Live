<?php error_reporting(E_ALL);
include 'connection.php'; 
$title = "SHL Livetabell";
$l = new Connection();
$t = $l->getToken();
?>
<!DOCTYPE html>
<html lang="sv" dir="ltr">
<head>
    <meta charset="UTF-8" />
    <link href="style.css" rel="stylesheet">
    <script>
            var token = "<?=$t?>";
    </script>
    <script src="script.js"></script>
    <title><?=$title?></title>
</head>
<body>
    <div id="table">
        <h1><?=$title?></h1>
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th><abbr title="Games Played">GP</abbr></th>
                    <th><abbr title="Goal Difference">GD</abbr></th>
                    <th>Points</th>
                    <th>Trending</th>
                </tr>
            </thead>
            <tbody id="liveTable">
            </tbody>
        </table>
    </div>
    <div id="games"></div>
</body>
</html>