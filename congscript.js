
$("#menu-toggle").click(function(e) {
        e.preventDefault();
        $(".wrapperSlider").toggleClass("active");      
});

var app = angular.module('Homework8', ['angularUtils.directives.dirPagination', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.controller('legislatorsCtrl', function($rootScope, $http, $filter) {
    
    $http.get("congressAPI.php", {params:{"param1": "states"}})
    .then(function (response) {
        $rootScope.legislatorsByState = response.data.results;
    });
    
    $rootScope.viewDetails = function(task){
        $rootScope.currentDetail=task;
        
        if($rootScope.currentDetail.color == undefined){
            $rootScope.currentDetail["color"] = "white";
        }

        $legFavorites = (localStorage.getItem('legFavorites')!==null) ? JSON.parse(localStorage.getItem('legFavorites')) : [];
        key = 'bioguide_id';

        for (var loopIndex = 0; loopIndex < $legFavorites.length; loopIndex++) {
            if ($legFavorites[loopIndex].bioguide_id == $rootScope.currentDetail.bioguide_id) {
                $rootScope.currentDetail["color"]="yellow";
                break;
            }
        }
        
        $http.get("congressAPI.php", {params:{"topParam1": $rootScope.currentDetail.bioguide_id}}).then(function (response) {
            $rootScope.topFiveCommittees = response.data.results;
        });

        $http.get("congressAPI.php", {params:{"topParam2": $rootScope.currentDetail.bioguide_id}}).then(function (response) {
            $rootScope.topFiveBills = response.data.results;
        });

        $rootScope.start = new Date();
        $rootScope.start = $rootScope.currentDetail.term_start;

        $rootScope.end = new Date();
        $rootScope.end = $rootScope.currentDetail.term_end;

        var currentDate = new Date();
        $rootScope.curDate = $filter('date')(new Date(), 'yyyy/MM/dd');

        var date2 = new Date($rootScope.formatString($rootScope.end));
        var date1 = new Date($rootScope.formatString($rootScope.start));
        var now = new Date($rootScope.formatString($rootScope.curDate));

        var timeDiff = Math.abs(now.getTime() - date1.getTime());   
        $rootScope.dayDifference1 = Math.ceil(timeDiff / (1000 * 3600 * 24));

        var timeDiff2 = Math.abs(date2.getTime() - date1.getTime());   
        $rootScope.dayDifference2 = Math.ceil(timeDiff2 / (1000 * 3600 * 24));

        var value = Math.ceil(($rootScope.dayDifference1/ $rootScope.dayDifference2)*100);

        $rootScope.dynamic = value;   

        $rootScope.birthday = new Date();
        $rootScope.birthday = $rootScope.currentDetail.birthday;
        
        $rootScope.addLegislatorFavorite = function(favLeg) {
            $rootScope.favsLegs = (localStorage.getItem('legFavorites')!==null) ? JSON.parse(localStorage.getItem('legFavorites')) : [];
            $indexVal = 0;
            $totalLength = $rootScope.favsLegs.length;

            for (var i = 0; i < $rootScope.favsLegs.length; i++) {
                $indexVal = i;
                if ($rootScope.favsLegs[i].bioguide_id == favLeg.bioguide_id) {
                    $totalLength = -1;
                    break;
                }
            }

            if($totalLength > -1){
                favLeg["color"]="yellow";
                $rootScope.favsLegs.push(favLeg);
                $rootScope.favsLegislators = $rootScope.favsLegs;
                for(var j = 0; j < $rootScope.legislatorsByState.length; j++) {

                    if (favLeg.bioguide_id == $rootScope.legislatorsByState[j].bioguide_id) {
                        $rootScope.legislatorsByState[j]["color"]="yellow";
                        break;
                    }
                }
                
                for(var j = 0; j < $rootScope.legislatorsByHouse.length; j++) {

                    if (favLeg.bioguide_id == $rootScope.legislatorsByHouse[j].bioguide_id) {
                        $rootScope.legislatorsByHouse[j]["color"]="yellow";
                        break;
                    }
                }
                
                for(var j = 0; j < $rootScope.legislatorsBySenate.length; j++) {

                    if (favLeg.bioguide_id == $rootScope.legislatorsBySenate[j].bioguide_id) {
                        $rootScope.legislatorsBySenate[j]["color"]="yellow";
                        break;
                    }
                }

                localStorage.setItem('legFavorites', JSON.stringify($rootScope.favsLegs));
            } else {
                favLeg["color"]="white";
                $rootScope.favsLegs.splice($indexVal, 1);
                $rootScope.favsLegislators = [];
                $rootScope.favsLegislators = $rootScope.favsLegs;

                for(var j = 0; j < $rootScope.legislatorsByState.length; j++) {

                    if (favLeg.bioguide_id == $rootScope.legislatorsByState[j].bioguide_id) {
                        $rootScope.legislatorsByState[j]["color"]="white";
                        break;
                    }
                }
                
                for(var j = 0; j < $rootScope.legislatorsByHouse.length; j++) {

                    if (favLeg.bioguide_id == $rootScope.legislatorsByHouse[j].bioguide_id) {
                        $rootScope.legislatorsByHouse[j]["color"]="white";
                        break;
                    }
                }
                
                for(var j = 0; j < $rootScope.legislatorsBySenate.length; j++) {

                    if (favLeg.bioguide_id == $rootScope.legislatorsBySenate[j].bioguide_id) {
                        $rootScope.legislatorsBySenate[j]["color"]="white";
                        break;
                    }
                }
                localStorage.setItem('legFavorites', JSON.stringify($rootScope.favsLegs));
            }
        };
    }
  
    $rootScope.formatString = function(format) {
        var day   = parseInt(format.substring(8,10));
        var month  = parseInt(format.substring(5,7));
        var year   = parseInt(format.substring(0,4));
        var date = new Date(year, month-1, day);
        return date;
    }
});


app.controller('houseCtrl', function($rootScope, $http) {
    $http.get("congressAPI.php", {params:{"param1": "house"}})
    .then(function (response) {
        $rootScope.legislatorsByHouse = response.data.results;
    });
});


app.controller('senateCtrl', function($rootScope, $http) {
    $http.get("congressAPI.php", {params:{"param1": "senate"}})
    .then(function (response) {
        $rootScope.legislatorsBySenate = response.data.results;
    });
});


app.controller('activeBillsCtrl', function($rootScope, $http) {
    $http.get("congressAPI.php", {params:{"param1": "active"}})
    .then(function (response) {
        //$rootScope.legislatorsByBills1 = response.data.results;
        $rootScope.legislatorsByBills = response.data.results;
    });
    
    $rootScope.viewBillDetail = function(billtask){
        $rootScope.currentBillDetail=billtask;

        $rootScope.introducedOn = new Date();
        $rootScope.introducedOn = $rootScope.currentBillDetail.introduced_on;
        
        if($rootScope.currentBillDetail.color == undefined){
            $rootScope.currentBillDetail["color"] = "white";
        }
        
        $billFavorites = (localStorage.getItem('billFavorites')!==null) ? JSON.parse(localStorage.getItem('billFavorites')) : [];
        key = 'bill_id';

        for (var loopIndex = 0; loopIndex < $billFavorites.length; loopIndex++) {
            if ($billFavorites[loopIndex].bill_id == $rootScope.currentBillDetail.bill_id) {
                $rootScope.currentBillDetail["color"]="yellow";
                break;
            }
        }
     }
    
    $rootScope.addBillFavorite = function(favBill) {
        $rootScope.favsBills = (localStorage.getItem('billFavorites')!==null) ? JSON.parse(localStorage.getItem('billFavorites')) : [];
        $indexVal = 0;
        $totalLength = $rootScope.favsBills.length;

        for (var i = 0; i < $rootScope.favsBills.length; i++) {
            $indexVal = i;
            if ($rootScope.favsBills[i].bill_id == favBill.bill_id) {
                $totalLength = -1;
                break;
            }
        }

        if($totalLength > -1){
            favBill["color"]="yellow";
            $rootScope.favsBills.push(favBill);
            $rootScope.favsAllBills = $rootScope.favsBills;
            for(var j = 0; j < $rootScope.legislatorsByBills.length; j++) {

                if (favBill.bill_id == $rootScope.legislatorsByBills[j].bill_id) {
                    $rootScope.legislatorsByBills[j]["color"]="yellow";
                    break;
                }
            }

            for(var j = 0; j < $rootScope.legislatorsByNewBills.length; j++) {

                if (favBill.bill_id == $rootScope.legislatorsByNewBills[j].bill_id) {
                    $rootScope.legislatorsByNewBills[j]["color"]="yellow";
                    break;
                }
            }

            localStorage.setItem('billFavorites', JSON.stringify($rootScope.favsBills));
        } else {
            favBill["color"]="white";
            $rootScope.favsBills.splice($indexVal, 1);
            $rootScope.favsAllBills = [];
            $rootScope.favsAllBills = $rootScope.favsBills;

            for(var j = 0; j < $rootScope.legislatorsByBills.length; j++) {

                if (favBill.bill_id == $rootScope.legislatorsByBills[j].bill_id) {
                    $rootScope.legislatorsByBills[j]["color"]="white";
                    break;
                }
            }

            for(var j = 0; j < $rootScope.legislatorsByNewBills.length; j++) {

                if (favBill.bill_id == $rootScope.legislatorsByNewBills[j].bill_id) {
                    $rootScope.legislatorsByNewBills[j]["color"]="white";
                    break;
                }
            }
            localStorage.setItem('billFavorites', JSON.stringify($rootScope.favsBills));
        }
    };
});

app.controller('newBillsCtrl', function($rootScope, $http) {
    $http.get("congressAPI.php", {params:{"param1": "new"}})
    .then(function (response) {
        $rootScope.legislatorsByNewBills = response.data.results;
    });
});


app.controller('comHouseCtrl', function($rootScope, $http) {
    
    $rootScope.legislatorsByComs1 = [];
    if(localStorage.getItem('committees')!==null){
        $rootScope.legislatorsByComs1 = JSON.parse(localStorage.getItem('committees'));
        for(var i = 0; i < $rootScope.legislatorsByComs1.length; i++) {
            if($rootScope.legislatorsByComs1[i].chamber == 'house') {
                
            $indexvv = JSON.parse(localStorage.getItem('comFavorites')).indexOf($rootScope.legislatorsByComs1[i]);
            $rootScope.legislatorsByComs1[i]["color"]="white";
            $rootScope.legislatorsByComs.push(angular.copy($rootScope.legislatorsByComs1[i]));
            }
        }
    }
    
    else{
        $http.get("congressAPI.php", {params:{"param1": "coms"}})
        .then(function (response) {
            $rootScope.legislatorsByComs1 = response.data.results;
            $rootScope.legislatorsByComs =[];
            
            $comFavorites = (localStorage.getItem('comFavorites')!==null) ? JSON.parse(localStorage.getItem('comFavorites')) : [];
            key = 'committee_id';
            
            for(var i = 0; i < $rootScope.legislatorsByComs1.length; i++) {
                
                $rootScope.legislatorsByComs1[i]["color"]="white";
                    
                for (var loopIndex = 0; loopIndex < $comFavorites.length; loopIndex++) {
                    if ($comFavorites[loopIndex].committee_id == $rootScope.legislatorsByComs1[i].committee_id) {
                        $rootScope.legislatorsByComs1[i]["color"]="yellow";
                        break;
                    }
                }
                
                $rootScope.legislatorsByComs.push(angular.copy($rootScope.legislatorsByComs1[i]));
            }
        });
    }
    
    
    $rootScope.addToFav = function(favCom) {
        $rootScope.favs = (localStorage.getItem('comFavorites')!==null) ? JSON.parse(localStorage.getItem('comFavorites')) : [];
        $indexVal = 0;
        $totalLength = $rootScope.favs.length;
        
        for (var i = 0; i < $rootScope.favs.length; i++) {
            $indexVal = i;
            if ($rootScope.favs[i].committee_id == favCom.committee_id) {
                $totalLength = -1;
                break;
            }
        }
        
        
        if($totalLength > -1){
            favCom["color"]="yellow";
            $rootScope.favs.push(favCom);
            $rootScope.favsCommittees = $rootScope.favs;
            for(var j = 0; j < $rootScope.legislatorsByComs.length; j++) {
                
                if (favCom.committee_id == $rootScope.legislatorsByComs[j].committee_id) {
                    $rootScope.legislatorsByComs[j]["color"]="yellow";
                    break;
                }
            }
            
            localStorage.setItem('comFavorites', JSON.stringify($rootScope.favs));
        } else {
            //var index = $rootScope.favs.indexOf(favCom);
            favCom["color"]="white";
            $rootScope.favs.splice($indexVal, 1);
            $rootScope.favsCommittees = [];
            $rootScope.favsCommittees = $rootScope.favs;
            
            for(var j = 0; j < $rootScope.legislatorsByComs.length; j++) {
                
                if (favCom.committee_id == $rootScope.legislatorsByComs[j].committee_id) {
                    $rootScope.legislatorsByComs[j]["color"]="white";
                    break;
                }
            }
            localStorage.setItem('comFavorites', JSON.stringify($rootScope.favs));
        }
    };
});


    app.controller('comSenateCtrl', function($rootScope, $http) {
        $http.get("congressAPI.php", {params:{"param1": "comsSenate"}})
        .then(function (response) {
            $rootScope.legislatorsByComsSenate1 = response.data.results;
            $rootScope.legislatorsByComsSenate =[];

            $comFavorites = (localStorage.getItem('comFavorites')!==null) ? JSON.parse(localStorage.getItem('comFavorites')) : [];
            key = 'committee_id';

            for(var i = 0; i < $rootScope.legislatorsByComsSenate1.length; i++) {

                $rootScope.legislatorsByComsSenate1[i]["color"]="white";

                for (var loopIndex = 0; loopIndex < $comFavorites.length; loopIndex++) {
                    if ($comFavorites[loopIndex].committee_id == $rootScope.legislatorsByComsSenate1[i].committee_id) {
                        $rootScope.legislatorsByComsSenate1[i]["color"]="yellow";
                        break;
                    }
                }
                $rootScope.legislatorsByComsSenate.push(angular.copy($rootScope.legislatorsByComsSenate1[i]));   
            }

    });
    
    
    $rootScope.addSenateComFavorite = function(favCom) {
        $rootScope.favsSen = (localStorage.getItem('comFavorites')!==null) ? JSON.parse(localStorage.getItem('comFavorites')) : [];
        $indexVal = 0;
        $totalLength = $rootScope.favsSen.length;
        
        for (var i = 0; i < $rootScope.favsSen.length; i++) {
            $indexVal = i;
            if ($rootScope.favsSen[i].committee_id == favCom.committee_id) {
                $totalLength = -1;
                break;
            }
        }
        
        if($totalLength > -1){
            favCom["color"]="yellow";
            $rootScope.favsSen.push(favCom);
            $rootScope.favsCommittees = $rootScope.favsSen;
            for(var j = 0; j < $rootScope.legislatorsByComsSenate.length; j++) {
                
                if (favCom.committee_id == $rootScope.legislatorsByComsSenate[j].committee_id) {
                    $rootScope.legislatorsByComsSenate[j]["color"]="yellow";
                    break;
                }
            }
            
            localStorage.setItem('comFavorites', JSON.stringify($rootScope.favsSen));
        } else {
            //var index = $rootScope.favs.indexOf(favCom);
            favCom["color"]="white";
            $rootScope.favsSen.splice($indexVal, 1);
            $rootScope.favsCommittees = [];
            $rootScope.favsCommittees = $rootScope.favsSen;
            
            for(var j = 0; j < $rootScope.legislatorsByComsSenate.length; j++) {
                
                if (favCom.committee_id == $rootScope.legislatorsByComsSenate[j].committee_id) {
                    $rootScope.legislatorsByComsSenate[j]["color"]="white";
                    break;
                }
            }
            localStorage.setItem('comFavorites', JSON.stringify($rootScope.favsSen));
        }
    };
});


app.controller('comJointCtrl', function($rootScope, $http) {
    $http.get("congressAPI.php", {params:{"param1": "comsJoint"}})
    .then(function (response) {
        $rootScope.legislatorsByComsJoint1 = response.data.results;
        $rootScope.legislatorsByComsJoint =[];
        
        $comFavorites = (localStorage.getItem('comFavorites')!==null) ? JSON.parse(localStorage.getItem('comFavorites')) : [];
        key = 'committee_id';

        for(var i = 0; i < $rootScope.legislatorsByComsJoint1.length; i++) {

            $rootScope.legislatorsByComsJoint1[i]["color"]="white";

            for (var loopIndex = 0; loopIndex < $comFavorites.length; loopIndex++) {
                if ($comFavorites[loopIndex].committee_id == $rootScope.legislatorsByComsJoint1[i].committee_id) {
                    $rootScope.legislatorsByComsJoint1[i]["color"]="yellow";
                    break;
                }
            }
            $rootScope.legislatorsByComsJoint.push(angular.copy($rootScope.legislatorsByComsJoint1[i]));   
        }
    });
    
    
    $rootScope.addJointComFavorite = function(favCom) {
        $rootScope.favsJoin = (localStorage.getItem('comFavorites')!==null) ? JSON.parse(localStorage.getItem('comFavorites')) : [];
        $indexVal = 0;
        $totalLength = $rootScope.favsJoin.length;
        
        for (var i = 0; i < $rootScope.favsJoin.length; i++) {
            $indexVal = i;
            if ($rootScope.favsJoin[i].committee_id == favCom.committee_id) {
                $totalLength = -1;
                break;
            }
        }
        
        if($totalLength > -1){
            favCom["color"]="yellow";
            $rootScope.favsJoin.push(favCom);
            $rootScope.favsCommittees = $rootScope.favsJoin;
            for(var j = 0; j < $rootScope.legislatorsByComsJoint.length; j++) {
                
                if (favCom.committee_id == $rootScope.legislatorsByComsJoint[j].committee_id) {
                    $rootScope.legislatorsByComsJoint[j]["color"]="yellow";
                    break;
                }
            }
            
            localStorage.setItem('comFavorites', JSON.stringify($rootScope.favsJoin));
        } else {
            
            favCom["color"]="white";
            $rootScope.favsJoin.splice($indexVal, 1);
            $rootScope.favsCommittees = [];
            $rootScope.favsCommittees = $rootScope.favsJoin;
            
            for(var j = 0; j < $rootScope.legislatorsByComsJoint.length; j++) {
                
                if (favCom.committee_id == $rootScope.legislatorsByComsJoint[j].committee_id) {
                    $rootScope.legislatorsByComsJoint[j]["color"]="white";
                    break;
                }
            }
            localStorage.setItem('comFavorites', JSON.stringify($rootScope.favsJoin));
        }
    };
    
});


// Favorite Legislators

app.controller('favLegisCtrl', function($rootScope) {
    
    $rootScope.favsLegislators = (localStorage.getItem('legFavorites')!==null) ? JSON.parse(localStorage.getItem('legFavorites')) : [];
    
    $rootScope.removeLegFromFav = function(favLeg) {
    
        $rootScope.oldfavsLegislators = (localStorage.getItem('legFavorites')!==null) ? JSON.parse(localStorage.getItem('legFavorites')) : [];
        
        $rootScope.newFavLegs = [];
        angular.forEach($rootScope.oldfavsLegislators, function(todo){
            if (todo.bioguide_id != favLeg.bioguide_id){
                todo["color"] = "yellow";
                $rootScope.newFavLegs.push(todo);
            }
        });
        
        for(var j = 0; j < $rootScope.legislatorsByState.length; j++) {
                
            if (favLeg.bioguide_id == $rootScope.legislatorsByState[j].bioguide_id) {
                $rootScope.legislatorsByState[j]["color"]="white";
                break;
            }
        }
        
        for(var j = 0; j < $rootScope.legislatorsByHouse.length; j++) {
                
            if (favLeg.bioguide_id == $rootScope.legislatorsByHouse[j].bioguide_id) {
                $rootScope.legislatorsByHouse[j]["color"]="white";
                break;
            }
        }
        
        for(var j = 0; j < $rootScope.legislatorsBySenate.length; j++) {
                
            if (favLeg.bioguide_id == $rootScope.legislatorsBySenate[j].bioguide_id) {
                $rootScope.legislatorsBySenate[j]["color"]="white";
                break;
            }
        }
        
        $rootScope.favsLegislators = $rootScope.newFavLegs;
        localStorage.setItem('legFavorites', JSON.stringify($rootScope.newFavLegs));
    };
});

// Favorite Bills

app.controller('favBillCtrl', function($rootScope) {
    
    $rootScope.favsAllBills = (localStorage.getItem('billFavorites')!==null) ? JSON.parse(localStorage.getItem('billFavorites')) : [];
    
    $rootScope.removeBillFromFav = function(favBill) {
    
        $rootScope.oldfavsAllBills = (localStorage.getItem('billFavorites')!==null) ? JSON.parse(localStorage.getItem('billFavorites')) : [];
        
        $rootScope.newFavBills = [];
        angular.forEach($rootScope.oldfavsAllBills, function(todo){
            if (todo.bill_id != favBill.bill_id){
                todo["color"] = "yellow";
                $rootScope.newFavBills.push(todo);
            }
        });
        
        for(var j = 0; j < $rootScope.legislatorsByBills.length; j++) {
                
            if (favBill.bill_id == $rootScope.legislatorsByBills[j].bill_id) {
                $rootScope.legislatorsByBills[j]["color"]="white";
                break;
            }
        }
        
        for(var j = 0; j < $rootScope.legislatorsByNewBills.length; j++) {
                
            if (favBill.bill_id == $rootScope.legislatorsByNewBills[j].bill_id) {
                $rootScope.legislatorsByNewBills[j]["color"]="white";
                break;
            }
        }

        $rootScope.favsAllBills = $rootScope.newFavBills;
        localStorage.setItem('billFavorites', JSON.stringify($rootScope.newFavBills));
    };
});


// Favorite Committees

app.controller('favComCtrl', function($rootScope) {
    
    $rootScope.favsCommittees = (localStorage.getItem('comFavorites')!==null) ? JSON.parse(localStorage.getItem('comFavorites')) : [];
    
    $rootScope.removeComFromFav = function(favCom) {
    
        $rootScope.oldfavsCommittees = (localStorage.getItem('comFavorites')!==null) ? JSON.parse(localStorage.getItem('comFavorites')) : [];
        
        $rootScope.todos = [];
        angular.forEach($rootScope.oldfavsCommittees, function(todo){
            if (todo.committee_id != favCom.committee_id){
                todo["color"] = "yellow";
                $rootScope.todos.push(todo);
            }
        });
        
        for(var j = 0; j < $rootScope.legislatorsByComs.length; j++) {
                
            if (favCom.committee_id == $rootScope.legislatorsByComs[j].committee_id) {
                $rootScope.legislatorsByComs[j]["color"]="white";
                break;
            }
        }
        
        for(var j = 0; j < $rootScope.legislatorsByComsSenate.length; j++) {
                
            if (favCom.committee_id == $rootScope.legislatorsByComsSenate[j].committee_id) {
                $rootScope.legislatorsByComsSenate[j]["color"]="white";
                break;
            }
        }
        
        for(var j = 0; j < $rootScope.legislatorsByComsJoint.length; j++) {
                
            if (favCom.committee_id == $rootScope.legislatorsByComsJoint[j].committee_id) {
                $rootScope.legislatorsByComsJoint[j]["color"]="white";
                break;
            }
        }
        
        $rootScope.favsCommittees = $rootScope.todos;
        localStorage.setItem('comFavorites', JSON.stringify($rootScope.todos));
    };
});

   function show() {
        
        $("#mainLeg").show();
        $("#myCarousel").carousel(1);
        $("#favoritesTab").hide();
        $("#pageTitle1").html("<h3 class='contentClass'>Legislators</h3>");
        
        return false;
    }

    function showBillDetails() {
        
        $("#mainBill").show();
        $("#myCarousel2").carousel(1);
        $("#favoritesTab").hide();
        $("#pageTitle1").html("<h3 class='contentClass'>Bills</h3>");
        
        return false;
    }

$(document).ready(function(){
    
    // legislators inner tabs
    $("#state").click(function(){
        $("#state1").show();
        $("#house1").hide();
        $("#senate1").hide();
    });
    
    $("#house").click(function(){
        $("#state1").hide();
        $("#house1").show();
        $("#senate1").hide();
    });
    
    $("#senate").click(function(){
        $("#state1").hide();
        $("#house1").hide();
        $("#senate1").show();
    });
    
    // mobile side tabs
    $("#legislatorsmob").click(function(){
        //$("#legislatorsTab").show();
        $("#mainLeg").show();
        $("#mainBill").hide();
        //$("#billsTab").hide();
        $("#committeesTab").hide();
        $("#favoritesTab").hide();
        
        //$("#carTab1").addClass("active");
        //$("#detailsCarousal").removeClass("active");
        //$("#billsDetailsCarousal").removeClass("active");
        $("#pageTitle1").html("<h3 class='contentClass'>Legislators</h3>");
    });
    
    $("#billsmob").click(function(){
        //$("#legislatorsTab").hide();
        $("#mainLeg").hide();
        $("#mainBill").show();
        //$("#billsTab").show();
        $("#committeesTab").hide();
        $("#favoritesTab").hide();
        
        //$("#billTab1").addClass("active");
        //$("#billsDetailsCarousal").removeClass("active");
        $("#pageTitle1").html("<h3 class='contentClass'>Bills</h3>");
    });
    
     $("#committeesmob").click(function(){
        //$("#legislatorsTab").hide();
        $("#mainLeg").hide();
        $("#mainBill").hide();
        $("#committeesTab").show();
        $("#favoritesTab").hide();
       // $("#billsDetailsCarousal").removeClass("active");
        $("#pageTitle1").html("<h3 class='contentClass'>Committees</h3>");
    });
    
     $("#favoritesmob").click(function(){
        //$("#legislatorsTab").hide(); 
        //$("#billsTab").hide();
        $("#mainLeg").hide();
        $("#mainBill").hide();
        $("#committeesTab").hide();
        $("#favoritesTab").show();
        //$("#billsDetailsCarousal").removeClass("active");
        $("#pageTitle1").html("<h3 class='contentClass'>Favorites</h3>");
    });
    
    
    
    $("#legislators").click(function(){
        //$("#legislatorsTab").show();
        $("#mainLeg").show();
        $("#mainBill").hide();
        //$("#billsTab").hide();
        $("#committeesTab").hide();
        $("#favoritesTab").hide();
        
        //$("#carTab1").addClass("active");
        //$("#detailsCarousal").removeClass("active");
        //$("#billsDetailsCarousal").removeClass("active");
        $("#pageTitle1").html("<h3 class='contentClass'>Legislators</h3>");
    });
    
    $("#bills").click(function(){
        
        //$("#legislatorsTab").hide();
        $("#mainLeg").hide();
        $("#mainBill").show();
        //$("#billsTab").show();
        $("#committeesTab").hide();
        $("#favoritesTab").hide();
        
        //$("#billTab1").addClass("active");
        //$("#billsDetailsCarousal").removeClass("active");
        $("#pageTitle1").html("<h3 class='contentClass'>Bills</h3>");
    });
    
    
    $("#committees").click(function(){
        //$("#legislatorsTab").hide();
        $("#mainLeg").hide();
        $("#mainBill").hide();
        $("#committeesTab").show();
        $("#favoritesTab").hide();
       // $("#billsDetailsCarousal").removeClass("active");
        $("#pageTitle1").html("<h3 class='contentClass'>Committees</h3>");
    });
    
    $("#favorites").click(function(){
        //$("#legislatorsTab").hide(); 
        //$("#billsTab").hide();
        $("#mainLeg").hide();
        $("#mainBill").hide();
        $("#committeesTab").hide();
        $("#favoritesTab").show();
        //$("#billsDetailsCarousal").removeClass("active");
        $("#pageTitle1").html("<h3 class='contentClass'>Favorites</h3>");
    });
    
    $("#active").click(function(){
        $("#bills1").show();
        $("#bills2").hide();
    });
    
    $("#new").click(function(){
        $("#bills1").hide();
        $("#bills2").show();
    });
    
    
    $("#comhouse").click(function(){
        $("#comhouse1").show();
        $("#comsenate1").hide();
        $("#comjoint1").hide();
    });
    
    $("#comsenate").click(function(){
        $("#comhouse1").hide();
        $("#comsenate1").show();
        $("#comjoint1").hide();
    });
    
    $("#joint").click(function(){
        $("#comhouse1").hide();
        $("#comsenate1").hide();
        $("#comjoint1").show();
    });
    
    $("#legis").click(function(){
        $("#favLegis").show();
        $("#favBills").hide();
        $("#favComs").hide();
    });
    
    $("#bil").click(function(){
        $("#favLegis").hide();
        $("#favBills").show();
        $("#favComs").hide();
    });
    
    $("#com").click(function(){
        $("#favLegis").hide();
        $("#favBills").hide();
        $("#favComs").show();
    });
        
});