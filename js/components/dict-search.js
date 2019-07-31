function dictSearchSetup() {

    if (DEBUG) console.log("Running dict-search.js");

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
            $(".dictFilter.start").focus()
        }
            
    });

    $("#numDictWords").text("Dictionary contains " + dict.length + " total words");

    $("#dictSearchStr").on("input", function () {
        dictSearchStr = $(this).val().toLowerCase();
        var minSearchLen = 3;
        
        if (dictSearchStr.length == 0) {
            $(this).removeClass("invalid");
            $("#dictSearch").removeClass("empty");
            $("#numDictWords").text("Contains " + dict.length + " total words");
            return;
        }
        if (dictSearchStr.length < minSearchLen) {
            dictSearchStr = "";
            $(this).addClass("invalid");
            $("#dictSearch").removeClass("empty");
            $("#numDictWords").text("Contains " + dict.length + " total words");
            return;
        }
        $(this).removeClass("invalid");

        dictQuery();
    });
    $("#searchTabSort input").on("change", function(e) {
        dictQuery();
    });
    $("#searchTabFilter input").on("change", function(e) {
        dictQuery();
    });

    function dictQuery() {
        fillWordList($("#dictSearch"), []);
        $("#numDictWords").text("");
        
        /* Dictionary List Filtering */
        if ($("#searchTabFilter input:checked").val() == "starts") {
            console.log("Filter by starts");
            dict.filtered = dict.filter(function (w,i){
                return (w.search(dictSearchStr) == 0);
            });
        } else {
            console.log("Filter by contains");
            dict.filtered = dict.filter(function (w,i){
                return (w.search(dictSearchStr) >= 0);
            });
        }

        /* Dictionary List Sorting */
        if ($("#searchTabSort input:checked").val() == "length") {
            console.log("Sorting by length");
            sortByLen(dict.filtered);
        } else {
            console.log("Sorting by alphabetical");
            dict.filtered.sort();
        }

        fillWordList($("#dictSearch"), dict.filtered);
        $("#numDictWords").text(dict.filtered.length + " word" + (dict.filtered.length==1?"":"s"));
    }
};