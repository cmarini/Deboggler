function delay(fn, ms) {
    let timer = 0
    return function(...args) {
      clearTimeout(timer)
      timer = setTimeout(fn.bind(this, ...args), ms || 0)
    }
}

function dictSearchSetup() {

    if (DEBUG) console.log("Running dict-search.js");

    var minSearchLen = 3;
    dictSearchStr = "";
    dictSearchFilter = "";
    dictSearchSort = "";

    $("#searchTabWrap").show();

    $("#searchTab").bind("click", function () {
        if ($(this).hasClass("open")) {
            $(this).removeClass("open");
            $('#searchWrap').hide(200);
        } else {
            $(this).addClass("open");
            $(".dictFilter.start").val("").keyup();
            $('#searchWrap').show(200);
            $("#dictSearchStr").focus()
        }
            
    });

    $("#numDictWords").text(`Dictionary contains ${DICT.wordCount} total words`);

    $("#dictSearchStr").on("input", delay(function () {
        dictSearchStr = $(this).val().toLowerCase();
        
        if (dictSearchStr.length == 0) {
            $(this).removeClass("invalid");
            $("#dictSearch").removeClass("empty");
            // return;
        }
        if (dictSearchStr.length < minSearchLen) {
            dictSearchStr = "";
            $(this).addClass("invalid");
            $("#dictSearch").removeClass("empty");
        } else {
            $(this).removeClass("invalid");
        }

        dictQuery();
    }, 250));
    $("#searchTabSort input").on("change", function(e) {
        dictQuery();
    });
    $("#searchTabFilter input").on("change", function(e) {
        dictQuery();
    });

    function dictQuery() {
        $("#numDictWords").text("Searching...");
        setTimeout(function() {
            $("#numDictWords").text(`Contains ${DICT.wordCount} total words`);
            if (dictSearchStr.length < minSearchLen) {
                fillWordList($("#dictSearch"), []);
                return;
            }
            console.time("DICTIONARY FILTERING");
            /* Dictionary List Filtering */
            if ($("#searchTabFilter input:checked").val() == "starts") {
                console.log("Filter by starts");
                console.time("-- DICT.searchStarts");
                dictFiltered = DICT.searchStarts(dictSearchStr)
                console.timeEnd("-- DICT.searchStarts");
            } else {
                console.log("Filter by contains");
                console.time("-- DICT.searchContains");
                dictFiltered = DICT.searchContains(dictSearchStr);
                console.timeEnd("-- DICT.searchContains");
            }

            /* Dictionary List Sorting */
            if ($("#searchTabSort input:checked").val() == "length") {
                console.log("Sort by length");
                sortByLen(dictFiltered);
            } else {
                console.log("Sort by alphabetical");
                dictFiltered.sort();
            }

            fillWordList($("#dictSearch"), dictFiltered);
            $("#numDictWords").text("Found " + dictFiltered.length + " word" + (dictFiltered.length==1?"":"s"));
            console.timeEnd("DICTIONARY FILTERING");
        }, 4);
    }
};