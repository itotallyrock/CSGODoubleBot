var bets = []; //Append new bets
var settings = {
    debug: true,
    basebet: 8,
    stopcount: -1,
    stopbet: 600,
    greenskip: 2,
};
var getBetString = function() {
    initBets();
    var r = "";
    for (var i = 10; i > 0; i--)
        r += bets[bets.length - i].toUpperCase();
    return r;
};
var oppositeRoll = function(roll) {
    if (roll.toUpperCase() == "R") return "B";
    if (roll.toUpperCase() == "B") return "R";
    if (roll.toUpperCase() == "G") return "G";
};
var isRainbow = function() {
    var r = false;
	// if (getBetString()[9] = getBetString()[7] && getBetString()[8] == getBetString()[6] && getBetString()[8] ==  oppositeRoll(getBetString()[9])) {
	// 	r = true;
	// }
	if (getBetString().substring(6,9) == "RBRB" || getBetString().substring(6,9) == "BRBR") {
		r = true;
	}
    // if (getBetString()[9] == oppositeRoll(getBetString()[8]) && getBetString()[8] == oppositeRoll(getBetString()[6])) {
    //     r = true;
    // }
    return r;
};

var isTrain = function() {
    var r = false;
    if (getBetString()[9] == getBetString()[8]) {
        r = true;
    }
    return r;
};

var afterRoll = function(roll) {
    addBet($(".ball").last());
};

var predict = function() {
    var r = " ";
    if (isRainbow()) {
        r = oppositeRoll(getBetString()[9]);
    } else if (isTrain()) {
        r = getBetString()[9];
    } else {
        r = "?";
    }
    if (getBetString()[9] == "G" || getBetString()[8] == "G") {
        r = "S";
    }
    return r;
};

var initBets = function() {
    $(".ball").each(function(i, e) {
        addBet(e);
    });
};

var addBet = function(e) {
    var n = parseInt($(e).text());
    if (n == 0) {
        bets[bets.length] = "G"
    } else if (n > 0 && n < 8) {
        bets[bets.length] = "R";
    } else if (n > 7 && n < 15) {
        bets[bets.length] = "B";
    }
}

var init = function() {
    $('#mainpage').prepend('<div class="predictme">' +
        '<div class="predict-btn btn btn-inverse">Predict</div>' +
        '<div class="ball ball-8">#</div>' +
        '</div>');
};

$('.predictme predict').on('click', function(e) {
    console.log('clicked predict');
    getNextBet();
});

var getNextBet = function() {
    bets = [];
    initBets();
    // $(".predictme .ball").text(predict());
    // if (predict() == "R") {
    //     $(".predictme .ball").removeClass('ball-8');
    //     $(".predictme .ball").addClass('ball-1');
    // } else if (predict() == "B") {
    //     $(".predictme .ball").removeClass('ball-1');
    //     $(".predictme .ball").addClass('ball-8');
    // } else {
    // 	$(".predictme .ball").removeClass('ball-1');
    // 	$(".predictme .ball").removeClass('ball-8');
    // }
    return predict();
}

init();
// var clicked = false;

var loop = setInterval(function() {
    if (settings.debug == true) console.log(predict());
    $("#betAmount").val(parseInt(settings.basebet).toString());
    var b = getNextBet();

	var total = 0;
    $(".mytotal").each(function(i, o) {
        total += parseInt($(o).text());
    });

	if (total >= settings.basebet) {
        // clicked == true;
    } else if (total == 0) {
        // clicked = false;
		if (b == "B") {
	        $("[data-upper=14]").click(); //Black
	        // clicked = true;
			$("#mainpage").css("background-color", "black")
	    } else if (b == "R") {
	        $("[data-upper=7]").click(); //R
	        // clicked = true;
			$("#mainpage").css("background-color", "red")
	    } else if (b == "G") {
	        $("[data-upper=0]").click(); //G
	        // clicked = true;
			$("#mainpage").css("background-color", "green")
	    } else if (b == "?" || b == "S") {
			$("#mainpage").css("background-color", "orange");
	        // clicked = true;
	    } else {
	        // clicked = false;
	    }
    }

    if (settings.debug == true) console.log("total = " + total);
}, 1000);

window.onbeforeunload = function() {
    clearInterval(loop);
    loop = undefined;
}
