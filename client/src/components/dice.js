export const comboDice = {
	"Q": "Qu",
	"I": "In",
	"T": "Th",
	"E": "Er",
	"H": "He",
	"A": "An",
};

export const comboCaps = Object.keys(comboDice).join("");
export const boardRegex = new RegExp("^[a-z" + comboCaps + "]*$");
export const dieRegex = new RegExp("[a-z" + comboCaps + "]", 'g');

export function toComboDie(string) {
	let char = string.substr(0, 1);
	if (!char.match(dieRegex)) {
		return "";
	}
	if (comboDice[char]) {
		return comboDice[char];
	}
	return char.toLowerCase();
}

export const diceVersions = [
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

/* Build Dice Lookup Table */
const calculateDiceLookup = () => {
	let lookup = {}
	diceVersions.forEach((ver, i) => {
		if (!lookup[ver.dice.length]) {
			lookup[ver.dice.length] = [];
		}
		lookup[ver.dice.length].push(ver);
	})
	return lookup;
};

export const diceLookup = calculateDiceLookup();