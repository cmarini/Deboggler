function dictSearchSetup() {

    if (DEBUG) console.log("Running dict-search.js");

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
    $(".dictFilter").bind("input", function () {
        var chars = $(this).val().toLowerCase();
        
        fillWordList($("#dictSearch"), []);
        $("#numDictWords").text("");
        
        var minSearchLen = 3;
        $(".dictFilter").not(this).val("").removeClass("invalid");
                
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

};