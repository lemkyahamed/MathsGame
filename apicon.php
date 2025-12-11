<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html");

//fetch data from the external API
echo file_get_contents("http://marcconrad.com/uob/heart/api.php")
?>