<?php
/**
 * Used to make calls to the SHL api to get around javascripts same-origin policy.
 * @author Erik Andersson
 */
include 'connection.php';
header('Content-Type: application/json');
$connection = new Connection();
http_response_code(200);
$data = array();
$token;
$action;
if(!isset($_GET["token"]) || $_GET["token"] === ""){
    http_response_code(400);
    $data = array('code' => 400, 'error' => 'invalid_token', 'error_description' => 'Field \'token\' is not set or is invalid.');
    echo json_encode($data);
    exit;
} else {
    $token = $_GET["token"];
}
if(!isset($data["code"]) && (!isset($_GET["action"]) || $_GET["action"] === "")){
    http_response_code(400);
    $data = array('code' => 400, 'error' => 'invalid_action', 'error_description' => 'Field \'action\' is not set or is invalid.');
    echo json_encode($data);
    exit;
} else {
    $action = $_GET["action"];
}
$params = getParams($action);
$paramVals = array();
if(!isset($data["code"])){
    foreach ($params as $param) {
        if(!isset($_GET[$param]) || $_GET[$param] === ""){
            http_response_code(400);
            $data = array('code' => 400, 'error' => 'invalid_param', 'error_description' => 'Field \''.$param.'\' is not set.');
            echo json_encode($data);
            exit;
            break;
        } else {
            array_push($paramVals, $_GET[$param]);
        }
    }
}
if (!isset($data["code"])) {
    switch ($action) {
        case "standings":
            $data = $connection->getStandingsWithToken($paramVals[0], $token);
            echo json_encode($data);
            exit;
            break;
        case "games":
            $data = $connection->getGames($paramVals[0], $token);
            echo json_encode($data);
            exit;
            break;
        case "game":
            $data = $connection->getGameInfo($paramVals[0], $paramVals[1], $token);
            echo json_encode($data);
            exit;
            break;
        case "teams":
            $data = $connection->getTeams($paramVals[0], $token);
            echo json_encode($data);
            exit;
            break;
        default:
            http_response_code(400);
            $data = array('code' => 400, 'error' => 'unknown', 'error_description' => array("input data: ",$_GET));
            echo json_encode($data);
            exit;
            break;
    }
    
}


function getParams($action) {
    $params = array();
    switch ($action) {
        case "standings":
            array_push($params, "year");
            break;
        case "games":
            array_push($params, "year");
            break;
        case "game":
            array_push($params, "year", "gameid");
            break;
        case "teams":
            array_push($params, "year");
            break;
        default:
            break;
    }
    return $params;
}