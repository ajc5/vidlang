/*
shownHints - {
  	start:
	dur:
   	line:
	wordInfos: {
		word
		stem
		trans
	}
}
*/

function getLineInfosFromXML(subsDat, srcLang, transLang) {
    let xmlSubs = new DOMParser().parseFromString(subsDat, "text/xml").childNodes[0].childNodes
    let subsArr = []
    for (let subtitleNode of xmlSubs) {
        subsArr.push({
            start: parseFloat(subtitleNode.getAttribute('start')),
            dur: parseFloat(subtitleNode.getAttribute('dur')),
			line: subtitleNode.textContent,
			lang: srcLang,
			transLang: transLang,
			wordInfos: getWordInfos(subtitleNode.textContent, srcLang, transLang)
        })
    }
	return subsArr
}

let stemmers = {}

function getWordInfos(text, srcLang, transLang) {
  let words = text.split(" ")
  let wordInfos = []
  for (let word of words) {
  	let wordInfo = {
		word: word,
		stem: getStemmed(word, srcLang)
	}
	if (transDict[srcLang] 
		&& transDict[srcLang][wordInfo.stem] 
		&& transDict[srcLang][wordInfo.stem]['langs'][transLang]) {
		let def = transDict[srcLang][wordInfo.stem]['langs'][transLang][0]
  		wordInfo.trans = def.trans[0]
		wordInfo.ipa = def.ipa
	 	wordInfo.pos = def.pos
	}
  	wordInfos.push(wordInfo)	
  }
  return wordInfos
}

function getStemmed(word, lang) {
	if (!stemmers[lang])
		stemmers[lang] = snowballFactory.newStemmer(lang)
	return stemmers[lang].stem(word.replace(/[^\w\d ]/g, '').trim().toLowerCase())
}

// function getWordInfo(srcWord, srcLang, transLang) {
//
// 	//setWordInfoObj(wordInfo, nativeLang, foreignLang)
// 	return wordInfo
// }

// function setWordInfoObj(wordInfo, nativeLang, foreignLang) {
//     let letters = []
// 	let wordDicEntry = trans[foreignLang][wordInfo.word]
// 	if (wordDicEntry && wordDicEntry.ipa) {
// 		ipaWord = wordDicEntry.ipa
// 		wordInfo.trans = wordDicEntry[nativeLang]
// 	    for (let i = 0; i < ipaWord.length; i++) {
// 	      let one = ipaWord[i], two = one + ipaWord[i + 1], ipaChar = false
// 	      // ignore diatrics if possible
// 	      if (ipa[two] && ipa[two].langs && ipa[two].langs[nativeLang]) {
// 	        ipaChar = two
// 	        i++
// 	      } else if (ipa[one] && ipa[one].langs && ipa[one].langs[nativeLang]) {
// 	        ipaChar = one
// 	      }
// 	      if (ipaChar) {
// 	        let charData = ipa[ipaChar].langs[nativeLang]
// 	        let foreign = charData.foreign
// 	        letters.push({
// 	          ipa: ipaChar,
// 	          icon: charData.icon,
// 	          iconText: `${charData.iconText} ${foreign ? foreign : ''}`,
// 	          say: charData.say,
// 	          type: ipaLetterType.vowels[ipaChar] ? "vowel" : "consonant"
// 	        })
// 	      } else {
// 	        letters.push({
// 	          ipa: one,
// 	          icon: "inactive-state",
// 	          text: one,
// 	          type: "",
// 	          say: " "
// 	        })
// 	      }
// 	    }
// 	}
// 	wordInfo.ipaLetters = letters
// }

function getWordInfoObj_v1(foreignWord, foreignLang, nativeLang) {
    let letters = [], 
		  foreignWordInfo = trans[foreignLang][foreignWord], 
		  ipaWord = foreignWordInfo.ipa, 
		  foreignWordTrans = foreignWordInfo[nativeLang]
	if (ipaWord) {
	    for (let i = 0; i < ipaWord.length; i++) {
	      let one = ipaWord[i], two = one + ipaWord[i + 1], ipaChar = false
	      // ignore diatrics if possible
	      if (ipa[two] && ipa[two].langs && ipa[two].langs[nativeLang]) {
	        ipaChar = two
	        i++
	      } else if (ipa[one] && ipa[one].langs && ipa[one].langs[nativeLang]) {
	        ipaChar = one
	      }
	      if (ipaChar) {
	        let charData = ipa[ipaChar].langs[nativeLang]
	        let foreign = charData.foreign
	        letters.push({
	          ipa: ipaChar,
	          icon: charData.icon,
	          iconText: `${charData.iconText} ${foreign ? foreign : ''}`,
	          say: charData.say,
	          type: ipaLetterType.vowels[ipaChar] ? "vowel" : "consonant"
	        })
	      } else {
	        letters.push({
	          ipa: one,
	          icon: "inactive-state", 
	          text: one,
	          type: "",
	          say: " "
	        })
	      }
	    }
	}
    return {
	  srcLang: "",
	  srcText: "",
      text: foreignWord, 
      ipaLetters: letters, 
      trans: foreignWordTrans, 
	  rawTrans: foreignWordTrans,
      speechPart: "", 
      icon: ""
    }
}

function getWordInfo_v1(word, foreignLangs, nativeLangs) {
  let fromWordFmt = fromWord.replace(/[^\w\d ]/g, '').trim().toLowerCase()
  if (!nativeLang) {
	nativeLang = toLang	
  }
  let wordInf
  if ((nativeLang === fromLang || nativeLang === toLang)
	  && trans[fromLang]) {
      let dictWord = trans[fromLang][fromWordFmt] ? fromWordFmt : snowballFactory.newStemmer(fromLang).stem(fromWordFmt)
	  if (trans[fromLang][dictWord]
	  	  && trans[fromLang][dictWord][toLang]) {
		if (fromLang === nativeLang) {
			let foreignWord = trans[fromLang][dictWord][toLang]
			if (trans[toLang]
				&& trans[toLang][foreignWord]
				&& trans[toLang][foreignWord][fromLang]) {
				wordInf = getWordInfoObj(foreignWord, toLang, fromLang)
			 	wordInf.trans = fromWord
			}
		} else {
			wordInf = getWordInfoObj(dictWord, fromLang, toLang)
			wordInf.text = fromWord
		}
	  }
  }
  if (!wordInf)
  	wordInf = {text: fromWord}
  return wordInf
}