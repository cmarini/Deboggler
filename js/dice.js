var comboDice = {
    "Q": "Qu",
    "I": "In",
    "T": "Th",
    "E": "Er",
    "H": "He",
    "A": "An",
};

comboCaps = Object.keys(comboDice).join("");
console.log("Combo Caps: " + comboCaps);
const boardRegex = new RegExp("^[a-z" + comboCaps + "]*$");
const dieRegex = new RegExp("[a-z" + comboCaps + "]", 'g');

function toComboDie (string) {
	let char = string.substr(0,1);
	if (!char.match(dieRegex)) {
		return "";
	}
	if (comboDice[char]) {
		return comboDice[char];
	}
	return char.toLowerCase();
}

var diceVersions = [
{
	"name": "Big Boggle (1979)",
	"dice": [
        "aaafrs",
		"aaeeee",
		"aafirs",
		"adennn",
		"aeeeem",
		"aeegmu",
		"aegmnn",
		"afirsy",
		"bjkQxz",
		"ccenst",
		"ceiilt",
		"ceilpt",
		"ceipst",
		"ddhnot",
		"dhhlor",
		"dhlnor",
		"dhlnor",
		"eiiitt",
		"emottt",
		"ensssu",
		"fiprsy",
		"gorrvw",
		"iprrry",
		"nootuw",
		"ooottu",
	]
},
{
	"name": "Boggle Deluxe (1997)",
	"dice": [
        "aaafrs",
		"aaeeee",
		"aafirs",
		"adennn",
		"aeeeem",
		"aeegmu",
		"aegmnn",
		"afirsy",
		"bjkQxz",
		"ccnstw",
		"ceiilt",
		"ceilpt",
		"ceipst",
		"ddlnor",
		"dhhlor",
		"dhhnot",
		"dhlnor",
		"eiiitt",
		"emottt",
		"ensssu",
		"fiprsy",
		"gorrvw",
		"hiprry",
		"nootuw",
		"ooottu",
	]
},
{
	"name": "Boggle Master (1993)",
	"dice": [
        "aaafrs",
		"aaeeee",
		"aafirs",
		"adennn",
		"aeeeem",
		"aeegmu",
		"aegmnn",
		"afirsy",
		"bjkqxz",
		"ccnstw",
		"ceiilt",
		"ceilpt",
		"ceipst",
		"ddlnor",
		"dhhlor",
		"dhhnot",
		"dhlnor",
		"eiiitt",
		"emottt",
		"ensssu",
		"fiprsy",
		"gorrvw",
		"hiprry",
		"nootuw",
		"ooottu",
	]
},
{
	"name": "Big Boggle (2012)",
	"dice": [
        "aaafrs",
		"aaeeee",
		"aafirs",
		"adennn",
		"aeeeem",
		"aeegmu",
		"aegmnn",
		"afirsy",
		"bbjkxz",
		"ccenst",
		"eiilst",
		"ceipst",
		"ddhnot",
		"dhhlor",
		"dhhnow",
		"dhlnor",
		"eiiitt",
		"eilpst",
		"emottt",
		"ensssu",
		"AEHIQT",
		"gorrvw",
		"iprsyy",
		"nootuw",
		"ooottu",
	]
},
{
	"name": "Boggle (c1976)",
	"dice": [
        "aaciot",
		"abilty",
		"abjmoQ",
		"acdemp",
		"acelrs",
		"adenvz",
		"ahmors",
		"bfiorx",
		"denosw",
		"dknotu",
		"eefhiy",
		"egintv",
		"egkluy",
		"ehinps",
		"elpstu",
		"gilruw",
	]
},
/* TODO: Implement blocked spaces
{
	"name": "Super Big Boggle",
	"dice": [
        "aaafrs",
		"aaeeee",
		"aaeeoo",
		"aafirs",
		"abdeio",
		"adennn",
		"aeeeem",
		"aeegmu",
		"aegmnn",
		"aeilmn",
		"aeinou",
		"afirsy",
		"AEHIQT",
		"bbjkxz",
		"ccenst",
		"cddlnn",
        "ceiitt",
		"ceipst",
		"cfgnuy",
		"ddhnot",
		"dhhlor",
		"dhhnow",
		"dhlnor",
		"ehilrs",
		"eiilst",
		"eilpst",
		"eio###",
		"emttto",
		"ensssu",
		"gorrvw",
		"hirstv",
		"hoprst",
        "iprsyy",
		"jkQwxz",
		"nootuw",
		"ooottu",
	]
},
*/
];

var defaultDice = diceVersions[0];
var diceLookup = [];

/* Build Dice Lookup Table */
diceVersions.forEach(function(ver,i) {
    console.log(ver.dice.length);
    if (!diceLookup[ver.dice.length]) {
        diceLookup[ver.dice.length] = [];
    }
    diceLookup[ver.dice.length].push(ver);
    /* 
    diceVersions[ver].dice.forEach(function(v, i) {
        diceVersions[ver].dice[i] = v.split("").sort().join("");
    });
    diceVersions[ver].dice.sort();
    console.log(diceVersions[ver].name);
    console.log(diceVersions[ver].dice);
    */
});

