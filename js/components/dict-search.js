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

    $("#numDictWords").text("Dictionary contains " + dict.length + " total words");

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
            $("#numDictWords").text("Contains " + dict.length + " total words");
            if (dictSearchStr.length < minSearchLen) {
                fillWordList($("#dictSearch"), []);
                return;
            }
            console.time("DICTIONARY FILTERING");
            /* Dictionary List Filtering */
            if ($("#searchTabFilter input:checked").val() == "starts") {
                console.log("Filter by starts");
                console.time("-- dict.filter starts");
                dict.filtered = dict.filter(function (w,i){
                    return (w.search(dictSearchStr) == 0);
                });
                console.timeEnd("-- dict.filter starts");
            } else {
                console.log("Filter by contains");
                console.time("-- dict.filter contains");
                dict.filtered = dict.filter(function (w,i){
                    return (w.search(dictSearchStr) >= 0);
                });
                console.timeEnd("-- dict.filter contains");
            }

            /* Dictionary List Sorting */
            if ($("#searchTabSort input:checked").val() == "length") {
                console.log("Sort by length");
                sortByLen(dict.filtered);
            } else {
                console.log("Sort by alphabetical");
                dict.filtered.sort();
            }

            fillWordList($("#dictSearch"), dict.filtered);
            $("#numDictWords").text("Found " + dict.filtered.length + " word" + (dict.filtered.length==1?"":"s"));
            console.timeEnd("DICTIONARY FILTERING");
        }, 4);
    }
};