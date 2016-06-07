<?php
/**
 * Used to maintain a connection with the SHL API.
 * @author Erik Andersson
 */
class Connection {
    const BASEURL = 'https://openapi.shl.se/';
    private $clientId = 'a2b3032d22668d39952c561d15dc8fe9';
    private $clientSecret = '7f2d9b114de308203b2e8a206534a737ccbcd248581c6920bb4acd188a387d6a';
    private $token;
    private $retrieved;
    private $expires;
    function __construct() {
        $this->retrieved = time();
        $this->expires=0;
    }
    
    public function getToken() {
        if(!isset($this->token) && ($this->expires*60)+$this->retrieved<=time()){
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL,  self::BASEURL."/oauth2/token");
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS,
                        "grant_type=client_credentials&client_id=".$this->clientId."&client_secret=".$this->clientSecret);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $tmp = curl_exec($ch);
            $result = json_decode($tmp,TRUE);
            curl_close($ch);
            $this->retrieved = time();
            $this->expires = $this->retrieved+$result["expires_in"];
            $this->token = $result["access_token"];
        }
        return $this->token;
    }
    public function getStandings($year) {
        return $this->getStandingsWithToken($year, $this->getToken());
    }
    public function getStandingsWithToken($year,$token) {
        $ch = curl_init();
        $url = self::BASEURL."seasons/".$year."/statistics/teams/standings";
        $headers = array('Authorization: Bearer ' . $token);
        curl_setopt($ch, CURLOPT_URL,  $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $tmp = curl_exec($ch);
        curl_close($ch);
        return json_decode($tmp,TRUE);
    }
    public function getGames($year) {
        return $this->getGamesWithToken($year, $this->getToken());
    }
    public function getGamesWithToken($year,$token) {
        $ch = curl_init();
        $url = self::BASEURL."seasons/".$year."/games";
        $headers = array('Authorization: Bearer ' . $token);
        curl_setopt($ch, CURLOPT_URL,  $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $tmp = curl_exec($ch);
        curl_close($ch);
        return json_decode($tmp,TRUE);
    }
    public function getGameInfo($year,$gameID) {
        return $this->getGameInfoWithToken($year, $gameID, $this->getToken());
    }
    public function getGameInfoWithToken($year,$gameID,$token) {
        $ch = curl_init();
        $url = self::BASEURL."seasons/".$year."/games/".$gameID;
        $headers = array('Authorization: Bearer ' . $token);
        curl_setopt($ch, CURLOPT_URL,  $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $tmp = curl_exec($ch);
        curl_close($ch);
        return json_decode($tmp,TRUE);
    }
    public function getTeams() {
        return $this->getTeamsWithToken($this->getToken());
    }
    public function getTeamsWithToken($token){
        $ch = curl_init();
        $url = self::BASEURL."teams";
        $headers = array('Authorization: Bearer ' . $token);
        curl_setopt($ch, CURLOPT_URL,  $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $tmp = curl_exec($ch);
        curl_close($ch);
        return json_decode($tmp,TRUE);
    }
    public function getTeam($team) {
        return $this->getTeamWithToken($team, $this->getToken());
    }
    public function getTeamWithToken($team, $token) {
        $ch = curl_init();
        $url = self::BASEURL."teams/".$team;
        $headers = array('Authorization: Bearer ' . $token);
        curl_setopt($ch, CURLOPT_URL,  $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $tmp = curl_exec($ch);
        curl_close($ch);
        return json_decode($tmp,TRUE);
    }
}