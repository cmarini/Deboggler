var boardSize;
var charLimit = 15;
var minCharLimit = 4;
var validWords;
var dictKeys;

var blankDie = '\xa0'; // &nbsp

var board;

var boardChanged = true;
var lastBoard = "";

var alphabetStart = 65;
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var comboCaps = "";
var letterRegex = "";

function buildDict()
{
    comboCaps = Object.keys(comboDice).join("");
    console.log("Combo Caps: " + comboCaps);
    
    letterRegex = new RegExp("^[a-z" + comboCaps + "]$");
    
    dictKeys = new Array();

    $("#indexProgVal").text("Indexing Dictionary...");
    dict.sort();
    dict.forEach(function (word, i) {
        if (i%100 == 0) {
            $("#indexProgVal").text((i) + " / " + dict.length + " (" +  Math.round(i*100/dict.length) + "%)");
            // $("#indexProgVal").redraw();
            // $("#indexProgWrap").css("height", Math.round(i*100/dict.length) + "%");
            // $("#indexProgVal").toggleClass("force-redraw");
            // $("#indexProgWrap").toggleClass("force-redraw");
            // $("#indexProgWrap").redraw();
        }
        var letters = word.substring(0,minCharLimit);
        if (letters.length >= minCharLimit) {
            if (!dict.hasOwnProperty(letters)) {
                dict[letters] = [];
            }
            dict[letters].push(word);
            if (DEBUG) dictKeys.push(letters);
        }
    });
    if (DEBUG) {
        
        dictKeys = removeDup(dictKeys);
        var max = 0;
        var avg = 0;
        var i;
        for (i in dictKeys) {
            var l = dict[dictKeys[i]].length;
            max = l>max ? l : max;
            avg += l;
        }
        avg /= i;
        $("#debug").append("Max Dictionary Segment Length: " + max + "</br>");
        $("#debug").append("Avg Dictionary Segment Length: " + Math.round(avg) + "</br>");
    }
    
    $("#numDictWords").text("Dictionary contains " + dict.length + " total words");
    $(".dictFilter").bind("input", function () {
        var chars = $(this).val().toLowerCase();
        
        fillWordList($("#dictSearch"), []);
        $("#numDictWords").text("");
        
        var minSearchLen;
        
        if ($(this).hasClass("start")) {
            minSearchLen = 3;
            $(".dictFilter.contain").val("");
            $(".dictFilter.contain").removeClass("invalid");
        } else if ($(this).hasClass("contain")) {
            minSearchLen = 3;
            $(".dictFilter.start").val("");
            $(".dictFilter.start").removeClass("invalid");
        } else {
            return;
        }
        
        if (chars.length == 0) {
            $(this).removeClass("invalid");
            $("#dictSearch").removeClass("empty");
            $("#numDictWords").text("Contains " + dict.length + " total words");
            return;
        }
        if (chars.length < minSearchLen) {
            $(this).addClass("invalid");
            $("#dictSearch").removeClass("empty");
            $("#numDictWords").text("Contains " + dict.length + " total words");
            return;
        }
        
        if ($(this).hasClass("start")) {
            dict.filtered = dict.filter(function (w,i){
                return (w.search(chars) == 0);
            });
        } else if ($(this).hasClass("contain")) {
            dict.filtered = dict.filter(function (w,i){
                return (w.search(chars) >= 0);
            });
        } else {
            return;
        }
        
        $(this).removeClass("invalid");

        if ($("#searchTabSort input:checked").val() == "length") {
            sortByLen(dict.filtered);
        } else {
            dict.filtered.sort();
        }
        fillWordList($("#dictSearch"), dict.filtered);
        $("#numDictWords").text(dict.filtered.length + " word" + (dict.filtered.length==1?"":"s"));
        
    });
}

function drawBoard()
{   
    var str = "";
    for (var row=0; row<boardSize; row++) {
        str += "<div class=dieRow>";
        for (var col=0; col<boardSize; col++) {
            str += "<div id=d_"+row+"_"+col+" class='die invalid' row="+row+" col="+col+">" + blankDie;
            str += "</div>";
        }
        str += "</div>";
    }
    $("#board").html(str);
    
    $('#resultsWrap').slideUp();
    $("#solveButton").hide();

    $('#boardInput').off('input change keydown click focus');
    $('#boardInput').on('input change keydown click focus', function (e) {
        console.log(e.type + ": " + $(this).val());
        
        var str = $(this).val();
        var sel_start = this.selectionStart;
        var sel_end = this.selectionStart + 1;
        
        if (e.type == "keydown") {
            console.log(e.key, e);
            switch(e.keyCode) {
                case 8: /* backspace */
                    e.preventDefault();
                    var newstr = str.substring(0, sel_start-1) + str.substring(sel_start);
                    console.log("Replacing: " + str);
                    console.log("     with: " + newstr);
                    $(this).val(newstr);
                    sel_start += -1;
                    sel_end += -1;
                    break;
                case 9: /* tab */
                    break;
                case 13: /* enter */
                    e.preventDefault();
                    solve();
                    break;
                case 37: /* left */ 
                    sel_start -= 1;
                    sel_end -= 1;
                    e.preventDefault();
                    break;
                case 38: /* up */ 
                    sel_start -= boardSize;
                    sel_start = sel_start < 0 ? sel_start + boardSize*boardSize : sel_start;
                    sel_end = sel_start + 1;
                    e.preventDefault();
                    break;                    
                case 39: /* right */ 
                    sel_start = Math.min(sel_start+1, $(this).val().length);
                    sel_end = sel_start + 1;
                    e.preventDefault();
                    break;
                case 40: /* down */ 
                    sel_start += boardSize;
                    sel_start %= boardSize*boardSize;
                    sel_end = sel_start + 1;
                    e.preventDefault();
                    break;
            }
            // $(this)[0].setSelectionRange(sel_start, sel_end);
        }
        if (e.type == "change") {
        }
        if (e.type == "input") {
        }
        
        var string = $(this).val().substring(0,boardSize*boardSize);
        var modified = string;
        /* .replace(/([A-PR-Z])/g, function(match) {
            return match.toLowerCase();
        }); */
        var boardRegex = new RegExp("[^a-z" + comboCaps + "]", 'g');
        modified = modified.replace(boardRegex, function(match) {
            return "";
        });
        $(this).val(modified);

        for (var i = 0; i < boardSize*boardSize; i++) {
           var c = modified.charAt(i)
           var rc = i2rc(i);
           validateDie(rc.row, rc.col, c);
        }
        
        sel_start = Math.max(sel_start, 0);
        sel_start = Math.min(sel_start, modified.length);
        sel_end = Math.max(sel_end, 1);
        sel_end = Math.min(sel_end, boardSize*boardSize);
        $(this)[0].setSelectionRange(sel_start, sel_end);
        
        var rc = i2rc(sel_start);
        
        $(".die.highlight").removeClass("highlight");
        $("#d_"+rc.row+"_"+rc.col).addClass("highlight");
        
        if (modified != lastBoard) {
            $('#resultsWrap').stop().slideUp();
        }
        if (validateBoard()) {
            if (!$("#solveButton").is(":visible") && modified != lastBoard) {
                $("#solveButton").stop().fadeIn();
            }
        } else {
            $("#resultsWrap").hide();
            $("#solveButton").hide();
        }
        lastBoard = modified;
    });

    $('.die').off('click');
    $('.die').on('click', function (e) {
        e.preventDefault();
        var row = parseInt($(this).attr("row"));
        var col = parseInt($(this).attr("col"));
        var idx = rc2i(row, col);
        
        console.log("die click " + [row, col, idx].join(", "));
        $("#boardInput")[0].setSelectionRange(idx, idx);
        $("#boardInput")[0].focus();
    });
    
    
    $('#boardInput').on('focusout', function (e) {
        $(".die.highlight").removeClass("highlight");
    });
}

function validateDie(row, col, letter)
{
    if (!letter.match(letterRegex)) {
        $("#d_"+row+"_"+col).text(blankDie);
        $("#d_"+row+"_"+col).addClass("invalid");
        return;
    }
    if (comboDice[letter]) {
        letter = comboDice[letter];
        letter = letter.replace(/^[a-z]/, function(match){ return match.toUpperCase(); });
    }
    $("#d_"+row+"_"+col).text(letter);
    $("#d_"+row+"_"+col).removeClass("invalid");
    
    return;
}

function validateBoard()
{
    return $(".die.invalid").length <= 0;
    
    $(".die").each(function () {
        if (!$(this).text().match(letterRegex)) {
            $(this).text("");
            $(this).addClass("invalid");
        }
    });
}

function createUsedMemo()
{
    var memo = new Array();
    for (var row=0; row<boardSize; row++) {
        memo[row] = new Array();
    }
    return memo;
}

function getBoard()
{
    board = [];
    var comboRegex = new RegExp("["+comboCaps+"]", "g");
    var boardStr = $('#boardInput').val();
    
    for (var row=0; row<boardSize; row++) {
        board[row] = [];
        for (var col=0; col<boardSize; col++) {
            var c = boardStr.charAt(rc2i(row,col));
            board[row][col] = c.replace(comboRegex, function(match) { return comboDice[match]; }).toLowerCase();
        }
    }
    return board; 
}

function clearResults()
{
    $("#results .resultsList").html("");
    // $("#results")[0].scrollByPages(-999);
    $("#resultsByLen .resultsList").html("");
    // $("#resultsByLen")[0].scrollByPages(-999);
    $("#numWords").text("");
    $("#resultsFilter").val("");
}
function solve()
{
    if (!validateBoard()) return;
    clearResults();
    getBoard();
    
    validWords = new Array();
    
    var memo = createUsedMemo();
    for (var row=0; row<boardSize; row++) {
        for (var col=0; col<boardSize; col++) {
            solveRecurse("", row, col, memo);
        }
    }
    
    validWords = removeDup(validWords);
    
    $("#solveButton").stop().hide();
    
    var count = validWords.length;
    $("#numWords").text("Found "+validWords.length+" word" + (count==1?"":"s"));
    $('#numWords').show();
    
    showResultWords(validWords);
    
    // $('#resultsWrap').stop().slideDown();
    $('#resultsWrap').stop().show();
    
    $("#resultsFilter").bind("keyup", function () {
        var chars = $(this).val().toLowerCase();
        validWords.filtered = validWords.filter(function (w,i){
            return !(w.search(chars));
        });
        showResultWords(validWords.filtered);
    });
    
    $(".die.highlight").removeClass("highlight");
    $("#resultsFilter").focus();
    $('html, body').animate({
        scrollTop: ($('#resultsWrap').offset().top)
    },500);
}

function sortByLen(words)
{
    /* Sort by length, then alpha */
    return words.sort(function (x, y) {
        var diff = y.length - x.length;
        if (diff == 0) {
            return (x<y?(-1):1);
        }
        return diff;
    });
}

function copyList(e)
{
    var ele = $(e).siblings().find(".resultsList").first();
    copy(validWords.filtered.join("\n"));
}

function fillWordList(container, words)
{
    if (!$(container).hasClass("resultsListContainer")) {
        return;
    }
    
    var listDiv = $(container).children(".resultsList");
    listDiv.html("");
    
    if (words.length == 0) {
        $(container).addClass("empty");
        return;
    }
    $(container).removeClass("empty");
    
    words.forEach(function (w, i){
         listDiv.append(""+w+"</br>");
    });
    
    // listDiv.find(".resultWord").first().addClass("first");
    // listDiv.find(".resultWord").last().addClass("last");
}

function showResultWords(words)
{   
    words.sort();
    fillWordList($("#results"), words);
    sortByLen(words);
    fillWordList($("#resultsByLen"), words);
}

function solveRecurse(word, row, col, memo)
{
    if (memo[row][col]) return;
    
    word += board[row][col];
    memo[row][col] = true;
    if (word.length >= minCharLimit) {
        if (canBeWord(word))
        {
            if (isWord(word)) {
                validWords.push(word);
            }
        } 
        else
        {
            memo[row][col] = false;
            return;
        }
    }
    if (word.length < charLimit)
    {
        for (var r=(-1); r<2; r++) {
            for (var c=(-1); c<2; c++) {
                if (row+r >= 0 && row+r < boardSize &&
                    col+c >= 0 && col+c < boardSize &&
                    !(r == 0 && c == 0)
                    ) 
                {
                    solveRecurse(word, row+r, col+c, memo);
                }
            }
        }
    }
    memo[row][col] = false;
}

function canBeWord(word)
{
    if (word.length >= minCharLimit) {
        if (dict.hasOwnProperty(word.substring(0,minCharLimit))) {
            return (dict[word.substring(0,minCharLimit)].filter(function (x){
                return !x.search(word);
            }).length);
        }
        return 0;
    }
    return 1;
}

function isWord(word)
{
    return !!(dict[word.substring(0,minCharLimit)].filter(function (x){
        return x==word;
    }).length);
}


function randomFill()
{
    var boardString = "";
    var dice;
    if (diceLookup && diceLookup[boardSize*boardSize] && diceLookup[boardSize*boardSize][0]) {
        dice = diceLookup[boardSize*boardSize][0].dice;
        /* Shuffle dice */
        var i, r, tmp;
        for (i = dice.length-1; i > 0; i--) {
            r = Math.floor(Math.random() * ( i + 1));
            tmp = dice[i];
            dice[i] = dice[r];
            dice[r] = tmp;
        }
        for (var i=0; i<boardSize*boardSize; i++) {
            boardString += dice[i].charAt(Math.floor(Math.random() * dice[i].length));
        }
    } else {
        for (var row=0; row<boardSize; row++) {
            for (var col=0; col<boardSize; col++) {
                var idx = Math.floor(Math.random()*26);
                // validateDie(row, col, alphabet[idx]);
                boardString = boardString + alphabet[idx];
            }
        }
    }
    $('#boardInput').val(boardString);
    $('#boardInput').change();
    // $("#resultsFilter").focus();
}

function removeDup (list)
{
    var prev = undefined;
    list.sort();
    return list.filter(function (x) {
        if( x != prev ) {
            prev = x;
            return true;
        }
        return false;
    });
}

function rc2i (r, c) {
    if (r >= boardSize || c >= boardSize) {
        return 0;
    }
    return (r * boardSize) + c;
}

function i2rc (i) {
    i = i % (boardSize*boardSize);
    var r, c;
    c =  i % boardSize
    r = Math.floor(i / boardSize);
    return {row : r, col : c};
}
