<!--
 | AUTHOR:
 |     J. Christian Marini
 |
 | DATE:
 |     Jul. 31, 2016
 
-->
<html>
<head>
    <title>deBoggler</title>
    
    <?php $p = dirname($_SERVER['SCRIPT_NAME']); ?>
    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $p ?>/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo $p ?>/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo $p ?>/favicon-16x16.png">
    <link rel="manifest" href="<?php echo $p ?>/site.webmanifest">
    <link rel="mask-icon" href="<?php echo $p ?>/safari-pinned-tab.svg" color="#b22222">
    <link rel="shortcut icon" href="<?php echo $p ?>/favicon.ico">
    <meta name="msapplication-TileColor" content="#2b5797">
    <meta name="msapplication-config" content="<?php echo $p ?>/browserconfig.xml">
    <meta name="theme-color" content="#fff3e2">
    <!-- Favicon -->

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" type="text/css" href="css/default.css">
    <script type="text/javascript">
        var DEBUG = true;
    </script>    

</head>
<!-- 
<body>
 -->
<!-- <body onload="main();"> -->
<body>
    <div id="settings">
        <div id="searchTabWrap">
            <button id="searchTab">Search Dictionary</button>
            <div id="searchWrap">
                <div id="searchSettings">
                    <div id="searchFiltersWrap">
                        <div class="inputWrap">
                            <label>Starts with:</label><input type="text" class="dictFilter start"/>
                        </div>
                        <div class="inputWrap">
                            <label>Contains:</label><input type="text" class="dictFilter contain"/>
                        </div>
                    </div>
                    <div id="searchTabSortWrap">Sort:
                        <div id="searchTabSort">
                            <input type="radio" name="sort" value="alphabetical" checked>Alphabetical
                            <br>
                            <input type="radio" name="sort" value="length">Length
                        </div>
                    </div>
                </div>
                <div id="numDictWords"></div>
                <div class="resultsListWrap">
                    <div id="dictSearch" class="resultsListContainer empty">
                        <div class="resultsList"></div>
                    </div>
                    <!-- <button onclick="copyList(this);">Copy to clipboard</button> -->
                </div>
            </div>
        </div>
        Board Size: <span min="2" max="20" id="boardSize">4</span><span>x4</span>
        <div class="arrowsContainer">
            <div class="arrowBox up outset" for="#boardSize">
                <div class="arrow up"></div>
            </div>
            <div class="arrowBox down outset" for="#boardSize">
                <div class="arrow down"></div>
            </div>
        </div>
        <button onclick="randomFill();">Randomize</button>
        <div id="comboDice">
        </div>
    </div>
    <input type="text" id="boardInput" pattern="[a-zQ]+">
    <div id="playArea" class="row">
        <div id="boardWrap" class="col">
            <div id="board"></div>
            <div id="solveContainer">
                <button onclick="solve();" id="solveButton">Find Words</button>
            </div>
        </div>
        
        <div id="resultsWrap" class="col">
            <div id="numWords"></div>
            <div id="filterWrap">
                <label>Filter:</label><input type="text" id="resultsFilter"/>
            </div>
            <div class="resultsListWrap card-2">
                <span>Alphabetical</span>
                <div id="results" class="resultsListContainer">
                    <div class="resultsList"></div>
                </div>
                <!-- <button onclick="copyList(this);">Copy to clipboard</button> -->
            </div>
            <div class="resultsListWrap card-2">
                <span>Length</span>
                <div id="resultsByLen" class="resultsListContainer">
                    <div class="resultsList"></div>
                </div>
                <!-- <button onclick="copyList(this);">Copy to clipboard</button> -->
            </div>
        </div>
        
    </div>
    <div id="indexProgWrap">
        <div id="indexProg">
            <div id="indexProgVal" class="">Getting Dictionary...</div>
        </div>
    </div>
    <code id="debug" style="display: none;">
    <?php
    echo "<br />";
    echo "Deboggler Version: ".date("m/d/y H:i:s.",filemtime("js/deboggler.js"));
    echo "<br />";
    ?>
    </code>

</body>
    
<script type="text/javascript" src="js/jquery.js"></script>
<!-- <script type="text/javascript" src="js/dict.js"></script> -->
<script type="text/javascript" src="js/deboggler.js"></script>
<script type="text/javascript" src="js/dice.js"></script>

<script type="text/javascript">
$(document).ready(function() {
    if (DEBUG) console.log("Running main()");
    $('#resultsWrap').hide();
    $('#searchWrap').hide();
    if (DEBUG) $('#debug').show();

    $('.arrowBox').bind('click', function () {
        var forEle = $($(this).attr("for"));
        var val = parseInt(forEle.text());
        var min = parseInt(forEle.attr("min"));
        var max = parseInt(forEle.attr("max"));
        if ($(this).hasClass("up")) val++;
        if ($(this).hasClass("down")) val--;
        
        if (val > max) val = max;
        if (val < min) val = min;
        forEle.text(val).next().text("x"+val);
        if (val != boardSize) {
            boardSize = val;
            drawBoard();
        }
    });
    $('.arrowBox.up').click();

    $('.arrowBox').bind('mousedown', function () {
        $(this).addClass("inset");
        $(this).removeClass("outset");
    });
    $('.arrowBox').bind('mouseup', function () {
        $(this).addClass("outset");
        $(this).removeClass("inset");
    });
    
    $.ajax({
        url: "js/dict.js",
        dataType: "script",
        cache: true,
        success: function(result) {
            $("#indexProgVal").text("Indexing Dictionary...");
            buildDict();
            dictSearchSetup();
            $("#indexProgWrap").fadeOut();
            $("#boardInput").focus();
        },
        // cache: true,
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            // xhr.onprogress = function (e) {
            xhr.addEventListener("progress", function (e) {
                // For downloads
                if (e.lengthComputable) {
                    // console.log(e.loaded / e.total);
                    $("#indexProgVal").text("Downloading dictionary data..." + e.loaded + " / " + e.total);
                } else if(e.loaded) {
                    $("#indexProgVal").html("Downloading dictionary data...<br>" + e.loaded + "b");
                } else {
                    $("#indexProgVal").text("Downloading dictionary data...");
                }
            }, false);
            xhr.upload.onprogress = function (e) {
                // For uploads
                if (e.lengthComputable) {
                    console.log(e.loaded / e.total);
                }
            };
            return xhr;
        },
    }).fail(function (e) {
        console.log("DOWNLOAD FAILED");
    }).then(function(data, status, xhr) {
        console.log(xhr.getAllResponseHeaders());
    });
});
</script>

<script type="text/javascript" src="js/components/dict-search.js"></script>

</html>

