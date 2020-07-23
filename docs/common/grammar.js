/* Only include grammar rules that dynamically modify words/sentences (eg, tense, plural/singluar) rather than vocabulary based (eg, PoS)
	- CLDR rules

let svoOrder = ["svo", "ovs"]

let verbTenses = ["present", "past"]

 let pos = ["noun", "pronoun", "verb", "adjective", "adverb", "preposition", "conjunction", "interjection", "quantifier", "article"]
 let articleGender = ["masculine", "feminine", "neutral"]
*/


// cldr
let pluralRules = {
	"all": ["zero", "one", "two", "few", "many", "other"],
	"en": [undefined, "one", undefined, undefined, undefined, "other"],
	"nl": [undefined, "one", undefined, undefined, undefined, "other"]
}
