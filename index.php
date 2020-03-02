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
    <script type="text/javascript">
        var DEBUG_useShortDict = false;
        <?php 
        $GIT_BRANCH = implode('/', array_slice(explode('/', file_get_contents('.git/HEAD')), 2));
        if (strtolower(trim($GIT_BRANCH)) != "master") {
            echo "var DEBUG = true;";
        } else {
            echo "var DEBUG = false;";
        }
        ?>
    </script>    
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
    <link rel="stylesheet" type="text/css" href="css/loader.css">

</head>
<body>
    <div id="settings">
        <div id="searchTabWrap">
            <button id="searchTab">Search Dictionary</button>
            <div id="searchWrap">
                <div id="searchSettings">
                    <div class="inputWrap">
                        <label>Search:</label><input type="text" id="dictSearchStr"/>
                    </div>
                    <div id="searchFiltersWrap" class="radioGroupWrap">Filter:
                        <div id="searchTabFilter" class="radioGroup">
                            <input type="radio" name="filter" value="starts" checked>Starts with
                            <br>
                            <input type="radio" name="filter" value="contains">Contains
                        </div>
                    </div>
                    <div id="searchTabSortWrap" class="radioGroupWrap">Sort:
                        <div id="searchTabSort" class="radioGroup">
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
        <div id="react-boggle-board-settings"></div>
    </div>
    <code id="debug" style="display: none;">
    </code>

</body>
    
<script type="text/javascript" src="js/jquery.js"></script>
<!-- <script type="text/javascript" src="js/dict.js"></script> -->
<!-- <script type="text/javascript" src="js/deboggler.js"></script> -->
<script type="text/javascript" src="js/dice.js"></script>

<script type="text/javascript">
let dict;
$(document).ready(function() {
    if (DEBUG) console.log("Running main()");
    if (DEBUG) $('#debug').show();
});
</script>

<script type="text/javascript" src="lib/components/dict-search.js"></script>

<!-- Load React. -->
<!-- Note: when deploying, replace "development.js" with "production.min.js". -->
<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

<!-- Load our React component. -->
<script src="lib/App.js" type="module"></script>
<script src="lib/Die.js" type="module"></script>
<script src="lib/Board.js" type="module"></script>
<script src="lib/BoardSettings.js" type="module"></script>
<script src="lib/BoardSolver.js" type="module"></script>

</html>

