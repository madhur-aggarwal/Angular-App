<?php
    ob_start();
    if(isset($_GET["param1"])){
            header('Content-Type: application/json');
            if($_GET["param1"] == "states"){
            $finalURL = "http://congress.api.sunlightfoundation.com/legislators?apikey=3c56faf5bb8a4f4ca701aee485ceb9c9&per_page=all";
            $jsonContent = file_get_contents($finalURL,false);
            echo $jsonContent;
            }
    }

    if(isset($_GET["param1"])){

        if($_GET["param1"] == "house"){
            header('Content-Type: application/json');
            $finalURL = "http://congress.api.sunlightfoundation.com/legislators?chamber=house&apikey=3c56faf5bb8a4f4ca701aee485ceb9c9&per_page=all";
            $jsonContent = file_get_contents($finalURL,false);
            echo $jsonContent;
        }
    }

    if(isset($_GET["param1"])){

            if($_GET["param1"] == "senate"){
                header('Content-Type: application/json');
                $finalURL = "http://congress.api.sunlightfoundation.com/legislators?chamber=senate&apikey=3c56faf5bb8a4f4ca701aee485ceb9c9&per_page=all";
                $jsonContent = file_get_contents($finalURL,false);
                echo $jsonContent;
            }
    }

    if(isset($_GET["param1"])){

        if($_GET["param1"] == "active"){
            header('Content-Type: application/json');
            $finalURL = "http://congress.api.sunlightfoundation.com/bills?apikey=3c56faf5bb8a4f4ca701aee485ceb9c9&history.active=true&per_page=50last_version.urls.pdf__exists=true&order=introduced_on";
            $jsonContent = file_get_contents($finalURL,false);
            echo $jsonContent;
        }
    }

    if(isset($_GET["param1"])){

        if($_GET["param1"] == "new"){
            header('Content-Type: application/json');
            $finalURL = "http://congress.api.sunlightfoundation.com/bills?apikey=3c56faf5bb8a4f4ca701aee485ceb9c9&history.active=false&per_page=50&last_version.urls.pdf__exists=true&order=introduced_on";
            $jsonContent = file_get_contents($finalURL,false);
            echo $jsonContent;
        }
    }

    if(isset($_GET["param1"])){

        if($_GET["param1"] == "coms"){
            header('Content-Type: application/json');
            $finalURL = "http://congress.api.sunlightfoundation.com/committees?apikey=3c56faf5bb8a4f4ca701aee485ceb9c9&chamber=house&per_page=all";
            $jsonContent = file_get_contents($finalURL,false);
            echo $jsonContent;
        }
    }


    if(isset($_GET["param1"])){

        if($_GET["param1"] == "comsSenate"){
            header('Content-Type: application/json');
            $finalURL = "http://congress.api.sunlightfoundation.com/committees?apikey=3c56faf5bb8a4f4ca701aee485ceb9c9&chamber=senate&per_page=all";
            $jsonContent = file_get_contents($finalURL,false);
            echo $jsonContent;
        }
    }


    if(isset($_GET["param1"])){

        if($_GET["param1"] == "comsJoint"){
            header('Content-Type: application/json');
            $finalURL = "http://congress.api.sunlightfoundation.com/committees?apikey=3c56faf5bb8a4f4ca701aee485ceb9c9&chamber=joint&per_page=all";
            $jsonContent = file_get_contents($finalURL,false);
            echo $jsonContent;
        }
    }

    if(isset($_GET["topParam1"])){

            $memberId = $_GET["topParam1"];
            $finalURL = "http://congress.api.sunlightfoundation.com/committees?apikey=3c56faf5bb8a4f4ca701aee485ceb9c9&per_page=5&member_ids=".$memberId;
            $jsonContent = file_get_contents($finalURL,false);
            echo $jsonContent;
    }


    if(isset($_GET["topParam2"])){

            $memberId = $_GET["topParam2"];
            $finalURL = "http://congress.api.sunlightfoundation.com/bills?apikey=3c56faf5bb8a4f4ca701aee485ceb9c9&per_page=5&sponsor_id=".$memberId;
            $jsonContent = file_get_contents($finalURL,false);
            echo $jsonContent;
    }

?>

