if (DEBUG) console.log("Running deboggler.js");

var dIndex = {}; // Indexed version of the dictionary
var boardSize;
var charLimit = 15;
var minCharLimit = 4;
var validWords;

var blankDie = '\xa0'; // &nbsp

var board;

var boardChanged = true;
var lastBoard = "";

var alphabetStart = 65;
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var comboCaps = "";
var letterRegex = "";

class Dictionary {
    constructor(name, dictGenerator, func_canBeWord, func_isWord, func_searchStart, func_searchContains) {
        this.name = name;
        this.dict = dictGenerator();
        this.canBeWord = func_canBeWord;
        this.isWord = func_isWord;
        this.searchStart = func_searchStart;
        this.searchContains = func_searchContains;
    }
}

var DICT;

function hideLoadingTab() {
    $("#dict-loading-tab-slider").animate(
        {
            bottom: "-" + ($("#dict-loading-tab").height() + 20),
        },
        {
            duration: "slow",
            complete: function(){$("#dict-loading-tab").hide()},
        }
    );
}

function buildDict()
{
    comboCaps = Object.keys(comboDice).join("");
    console.log("Combo Caps: " + comboCaps);
    
    letterRegex = new RegExp("^[a-z" + comboCaps + "]$");
    

    // $("#indexProgVal").text("Indexing Dictionary...");
    // dict.sort();
    // dict.forEach(function (word, i) {
    //     charLimit = word.length>charLimit?word.length:charLimit;
    // });
    // console.log(`Longest word is ${charLimit} characters`);

    DICT = new Dictionary("Binary Search String", 
        function() {
            var d;
            console.time("Build Dict: Binary Search String ");
            $.ajax({
                url: "php/buildDict.php",
                dataType: "JSON",
                cache: false,
                success: function(result) {
                    console.log(result);
                    DICT.dict = result;
                    
                    var wordCount = 0;
                    var dictSliceKeys = Object.keys(result);
                    // iterate dict by starting letter
                    dictSliceKeys.forEach(function (key) {
                        var dictSlice = result[key];
                        var radices = Object.keys(dictSlice);
                        // Iterate over each dict string at least that length
                        for (var i = 0; i < radices.length; i++) {
                            dictStr = dictSlice[radices[i]];
                            wordCount += dictStr.length / radices[i];
                        }
                    });
                    DICT.wordCount = wordCount;
                    console.log(`Dict contains ${wordCount} words`);

                    $('#debug').append("DONE DOWNLOADING DICTIONARY");
                    hideLoadingTab();
                },
            }).fail(function (e) {
                console.log("DOWNLOAD FAILED");
            }).then(function(data, status, xhr) {
                console.log(xhr.getAllResponseHeaders());
                dictSearchSetup();
            });
            console.timeEnd("Build Dict: Binary Search String ");
            return d;
        }, 
        function(word) { // Can Be Word
            var suffix = word.substring(1);
            var radix = suffix.length;
            var dictSlice = this.dict[word.substring(0,1)];
            var keys = Object.keys(dictSlice);
            var dictStr;
            for (radix; radix <= keys[keys.length-1]; radix++) {
                if (!dictSlice.hasOwnProperty(radix)) {
                    continue;
                }
                dictStr = dictSlice[radix];
                var l = 0;
                var m;
                var h = dictStr.length/radix - 1;
                while (l <= h) {
                    m = Math.floor((l + h) / 2);
                    var str = dictStr.substr(m*radix, radix).substring(0,suffix.length);
                    if (suffix > str) {
                        l = m + 1;
                    }
                    else if (suffix < str) {
                        h = m - 1;
                    }
                    else {
                        return word.substring(0,1) + str;
                    }
                }
            }
            return false;
        },
        function (word) { // Is Word
            var suffix = word.substring(1);
            var radix = word.length-1;
            var dictStr = this.dict[word.substr(0,1)][radix];
            if (!dictStr) {
                return false;
            }
            var l = 0;
            var m;
            var h = dictStr.length/radix - 1;
            while (l <= h) {
                m = Math.floor((l + h) / 2);
                var str = dictStr.substr(m*radix, radix);
                if (suffix > str) {
                    l = m + 1;
                }
                else if (suffix < str) {
                    h = m - 1;
                }
                else {
                    return word.substring(0,1) + str;
                }
            }
            return false;
        },
        function (word) { // Search Start
            
            return;
        },
        function (word) { // Search Contains
            var matchList = [];
            // var suffix = word.substring(1);
            var d = this.dict;
            var radix;
            var dictSliceKeys = Object.keys(d);
            // iterate dict by starting letter
            dictSliceKeys.forEach(function (key) {
                if (word.indexOf(key) >= 0) {
                    // the search term could be in this dict key
                    radix = word.length-1;
                } else {
                    // search term does not contain the key letter. Must be at least one letter longer.
                    radix = word.length;
                }
                var dictSlice = d[key];
                var radices = Object.keys(dictSlice);
                // Iterate over each dict string at least that length
                for (var r = 0; r < radices.length; r++) {
                    if (!dictSlice.hasOwnProperty(radix)) {
                        radix++;
                        continue;
                    }
                    var words = chunkString(dictSlice[radix], radix);
                    var w;
                    for (var i = 0; i < words.length; i++) {
                        w = key + words[i];
                        if (w.indexOf(word) >=0 ) {
                            //console.log(w);
                            matchList.push(w);
                        }
                    }
                    radix++;
                }
            });
            return matchList;
        }
    );
}

function drawBoard()
{   
    $("#board").empty();
    for (var row=0; row<boardSize; row++) {
        var dieRow = $("<div/>", {
            'class': "dieRow",
        });
        for (var col=0; col<boardSize; col++) {
            dieRow.append(
                $("<div/>", {
                    'id': "d_"+row+"_"+col,
                    'class': 'die invalid',
                    'row': row,
                    'col': col,
                    // 'tabindex': 0,
                    // 'contenteditable': 'true',
                })
            );
        }
        $("#board").append(dieRow);
    }
    
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
    
    console.log("-- SOLVING BOARD");
    console.time("-- SOLVING BOARD");
    validWords = new Array();
    
    var memo = new Array();
    for (var row=0; row<boardSize; row++) {
        memo[row] = new Array();
    }
    for (var row=0; row<boardSize; row++) {
        for (var col=0; col<boardSize; col++) {
            solveRecurse("", row, col, memo);
        }
    }
    console.timeEnd("-- SOLVING BOARD");
    
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
        console.error("Not a valid container!", container);
        return;
    }
    
    var listDiv = $(container).children(".resultsList");
    
    console.time("fillWordList() > html(\"\")");
    listDiv.html("");
    console.timeEnd("fillWordList() > html(\"\")");

    if (words.length == 0) {
        $(container).addClass("empty");
        return;
    }
    $(container).removeClass("empty");
    
    console.time("fillWordList() > js join");
    listDiv.append(words.join("</br>"));
    console.timeEnd("fillWordList() > js join");
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
    if (word.length >= 2) {
        if (DICT.canBeWord(word))
        {
            if (word.length >= minCharLimit) {
                if (DICT.isWord(word)) {
                    validWords.push(word);
                }
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

function chunkString(str, len) {
    var size = str.length / len + .5 | 0,
        ret  = new Array(size),
        offset = 0;
  
    for(var i = 0; i < size; ++i, offset += len) {
      ret[i] = str.substring(offset, offset + len);
	}
	return ret;
}