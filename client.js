var settings = {
    debug: false,
    basebet: parseInt(prompt("Basebet", "25")),
    stopcount: -1,
    stopbet: 600,
    greenskip: 2,
};
var getBetString = function() {
    var r = "";
    $(".ball").each(function(i, e) {
        var n = parseInt($(e).text());
        if (n == 0) {
            r += "G"
        } else if (n > 0 && n < 8) {
            r += "R";
        } else if (n > 7 && n < 15) {
            r += "B";
        }
    });
    return r;
};
var oppositeRoll = function(roll) {
    if (roll.toUpperCase() == "R") return "B";
    if (roll.toUpperCase() == "B") return "R";
    if (roll.toUpperCase() == "G") return "G";
};
var isRainbow = function() {
    var r = false;
    if (getBetString().substring(7, 10) == "BRB" || getBetString().substring(7, 10) == "RBR") {
        r = true;
    }
    return r;
};
var isTrain = function() {
    var r = false;
    if (getBetString()[9] == getBetString()[8]) {
        r = true;
    }
    return r;
};
var trainLength = function() {
    return getBetString().replace(/([RGB])\1+$/, "T").replace(/[RGB]/g, "").length + 1;
}
var predict = function() {
    var r = " ";
    if (isRainbow()) {
        r = oppositeRoll(getBetString()[9]);
    } else if (isTrain()) {
        r = getBetString()[9];
    } else {
        r = "?";
    }
    for (var i = 0; i < settings.greenskip; i++) {
        if (getBetString()[9 - i] == "G" || getBetString()[8 - i] == "G") {
            r = "S";
        }
    }
    return r;
};
var getBetValue = function() {
    var bet = (trainLength() - 1) * Math.floor(settings.basebet / 4) + settings.basebet;

    return bet;
};

var placeBet = function() {
    if (settings.debug == true) console.log(predict());
    var b = predict();
    $("#betAmount").val(parseInt(getBetValue()).toString());
    if (b == "B") {
        $("[data-upper=14]").click(); //Black
        $(".navbar").css("background-color", "#444")
    } else if (b == "R") {
        $("[data-upper=7]").click(); //R
        $(".navbar").css("background-color", "#ff0055")
    } else if (b == "G") {
        $("[data-upper=0]").click(); //G
        $(".navbar").css("background-color", "#449d44")
    } else if (b == "?" || b == "S") {
        $(".navbar").css("background-color", "#ffa500");
    } else {
        //Something unexpected predicted
    }
    if (settings.debug == true) console.log("total = " + total);
};

var loop = setInterval(function() {

    var open = ($("#banner").text().indexOf("Rolling") > -1);
    var rolled = ($("#banner").text().indexOf("CSGO") > -1);
    var confirming = ($("#banner").text().indexOf("Confirming") > -1);
    var rolling = ($("#banner").text().indexOf("***R") > -1);

    var total = 0;
    $(".mytotal").each(function(i, o) {
        total += parseInt($(o).text());
    });

    if (open && !(total >= settings.basebet)) {
        placeBet();
    }
}, 1000);

window.onbeforeunload = function() {
    clearInterval(loop);
    loop = undefined;
}
