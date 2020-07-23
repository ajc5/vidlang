

/*

Games:
- reading/speaking - play muted foreign video with subtitles and read it aloud correctly
- listening/writing - play foreign video (hide subtitles) and write/transcribe it correctly

Matching:
- script family
- pronunciation / spelling
	- alphabet
	- word
	- partial word
	- number symbol
- cognates
- grammar conventions (see grammar.js)
- calendar - day, month, year

Multilingual learning through language tree.
Shared:
- script
- vocab:
-- spelling
-- pronunciation
-- definition
-- group, eg, numbers, currency, name types
- grammar
- phonemes (front n side mouth views with motion)

- make money by letting people sell language hints for movies, shows, etc.

Steps:
- enabled lang hints for websites, videos, audio, games.
- track learning progress with visual charts

*/

// include trans.js, lang-names.js

let player, 
    subs,
    state,
    playbackRate = 0.5,
	currenTs,
	langs = {native: "en", foreign: "nl"},
    startTimeMs = new Date().getTime()
    currSubIdx = 0
let tag = document.createElement('script')
tag.src = "https://www.youtube.com/iframe_api"
let firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

let v = new URL(window.location.href.toString()).searchParams.get('v')
if (v != null) {
	loadSubs(v)
} else {
	setSubtitle(`
		Youtube Video ID/URL: <input id="videoInput" type="text" size="50"></input><button>📂</button><button onclick="loadVideo()">▶️ Load Video</button>
		Learn: <select><option>Dutch</option><option>more...</option></select> 
		Using: <select><option>English</option><option>Visuals</option><option>more...</option></select>
		<br>Example: <a href="#" onclick="loadVideoLink(this.innerHTML)">nonLimlR5Qk</a> or <a href="#" onclick="loadVideoLink(this.innerHTML)">https://www.youtube.com/watch?v=nonLimlR5Qk</a>`)
}

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

//var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
//var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
//var speechRecognitionList = new SpeechGrammarList();
//speechRecognitionList.addFromString(grammar, 1);
//recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = langs.foreign;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = function(event) {
	document.getElementById('subtitle').querySelector('.textInput').value = `${event.results[0][0].transcript}`
  	setResultBox(`✅ ${Math.round(event.results[0][0].confidence * 100)}%`)
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
	setResultBox("I didn't recognise that.")
}

recognition.onerror = function(event) {
	setResultBox('Error occurred in recognition: ' + event.error)
}

function setResultBox(html) {
	return document.getElementById('subtitle').querySelector('.result').innerHTML = html
}
function loadVideoLink(text) {
	document.getElementById("videoInput").value = text
}

function loadVideo() {
	let videoText = document.getElementById("videoInput").value
	let videoId = videoText
	try {
		videoId = new URL(videoText).searchParams.get('v')
	} catch (e) {
	}
	let url = new URL(window.location.href.toString())
	url.searchParams.set('v', videoId)
	window.location.href = url
}

function showVideo() {
	setSubMenu(`Video<br>
		<a href="#" onclick="showTranscript()">Transcript</a> |
		<a href="#" onclick="showWords()">Words by FirstLastLetters (${getWords().length})</a>`)
}

function showBridge() {
setSubMenu(`
	Bridge<br>
	<a href="#" onclick="showPronunciationMatches()">Word Pronunciation Matches (${Object.keys(getPronunciationMatches()).length})</a> |
	<a href="#" onclick="showSpellingMatches()">Word Spelling Matches (${getSpellingMatches().length})</a> |
	<a href="#" onclick="showCognates()">Cognates (${cognates.length})</a> |
	<a href="#" onclick="showGrammarSimilarities()">Grammar Similarities</a>`
	)
}

function setSubMenu(menuContent, contentFunc) {
	document.getElementById("submenu").innerHTML = menuContent
if (contentFunc)
	contentFunc()
else
	document.getElementById("content").innerHTML = ''
}

function showGrammarSimilarities() {
	let table = ""
	Object.entries(pluralRules).forEach(entry => {
		table += `<tr><td>${entry[0]}</td><td>${entry[1].join('</td><td>')}</td></tr>`
	})
	document.getElementById("content").innerHTML = `<table>${table}</table>`		  
}

function showTranscript() {
	showHints(subs)
}

function showWords() {
	 document.getElementById("content").innerHTML = '<table>' + getWords().map(entry => `<tr><td>${entry[1].stem}</td><td>${entry[1].trans ? entry[1].trans : ''}</td></tr>`).join('') + '</table>'
}

function showPronunciationMatches() {
  let prons = `<tr><td>English</td><td>Dutch</td></tr>`
  let pronMatches = getPronunciationMatches()
  Object.values(pronMatches).forEach((words, i) => {
	  prons += `<tr><td>${words[langs.native]}</td><td>${words[langs.foreign]}</td></tr>`
  })
  prons = `Word Pronunciation Matches: ${Object.keys(pronMatches).length}<br><br><table>${prons}</table>`
  document.getElementById("content").innerHTML = prons		  
}

function showSpellingMatches() {
  let splMatches = getSpellingMatches()
  document.getElementById("content").innerHTML = `Word Spelling Matches: ${splMatches.length}<br><br>${getMatchStrArray(splMatches).join('<br>')}`
}

function getMatchStrArray(splMatches) {
	return splMatches.map(x => x.word + ' (' + x.pos + ')')
}

function showCognates() {
  document.getElementById("content").innerHTML = `Cognates: ${cognates.length}<br><br>
	<table>
		<tr>
			<td>${langNames[langs.native][langs.native]}</td>
			<td>${langNames[langs.native][langs.foreign]}</td>
		</tr>
		${cognates.reduce((str, obj) => (str + '<tr><td>' + obj[langs.native] + '</td><td>' + obj[langs.foreign] + '</td></tr>'), "")}
	</table>`
}

function getWords() {
	let words = {}
	subs.forEach(sub => {
		sub.wordInfos.forEach(wordInfo => {
			words[wordInfo.stem] = wordInfo
		})
	})
	let wordsArray = Object.entries(words).sort((w1, w2) => {
		let a = w1[0], b = w2[0]
		if (a.length > b.length) {
			return 1
		} else if (a.length < b.length) {
			return -1
		} else {
			
			let val, al = a.length - 1, bl = b.length - 1
			if ((a[0] === b[0] && a[al] === b[bl])) {
				val = 0	
			} else if (a[0] < b[0] || (a[0] < b[0] && a[al] < b[bl])) {
				val = -1
			} else {
				val = 1
			}
			return val
		}
	})
	return wordsArray
}

function getSpellingMatches() {
	let matches = []
	if (transDict[langs.foreign]) {
		Object.entries(transDict[langs.foreign]).forEach(([foreignWord, transInfo]) => {
			let skip = false
			for (let i = 0; i < transInfo.langs[langs.native].length && !skip; i++) {
				for (let j = 0; j < transInfo.langs[langs.native][i].trans.length && !skip; j++) {
					if (transInfo.langs[langs.native][i].trans[j] === foreignWord) {
						matches.push({
							word: foreignWord, 
							pos: transInfo.langs[langs.native][i].pos
						})
						skip = true
					}
				}
			}
				
		})	
	}
	return matches
}

function getPronunciationMatches() {
	let nativeWords = {}, matches = {}
	if (transDict[langs.native])
		Object.entries(transDict[langs.native]).forEach(([nativeWord, transInfo]) => {
			if (transInfo.ipa) {
				if (!nativeWords[transInfo.ipa])
					nativeWords[transInfo.ipa] = []
				nativeWords[transInfo.ipa].push(nativeWord)
			}
		})
	if (transDict[langs.foreign])
		Object.entries(transDict[langs.foreign]).forEach(([foreignWord, transInfo]) => {
			if (nativeWords[transInfo.ipa]) {
				if (!matches[transInfo.ipa])
					matches[transInfo.ipa] = {[langs.native]: nativeWords[transInfo.ipa], [langs.foreign]: []}
				matches[transInfo.ipa][langs.foreign].push(foreignWord)
			}	
		})
	return matches
}

function loadSubs(videoId) {         
	let langListLink = `https://video.google.com/timedtext?type=list&v=${videoId}`
    fetch(langListLink)
    .then(r => {
        return r.text()
    })
    .then(dat => {
        let xmlDat = (new window.DOMParser()).parseFromString(dat, "text/xml")
        let tracks = xmlDat.childNodes[0].childNodes
        for (let track of tracks) {
            let langCode = track.getAttribute('lang_code')
            if (langs.foreign === langCode.substring(0, 2)) {
				let transcriptLink = `https://video.google.com/timedtext?lang=${langCode}&v=${videoId}`
				fetch(transcriptLink)
                .then(r => {
                    return r.text()
                })
                .then(subsDat => {
                    subs = getLineInfosFromXML(subsDat, langs.foreign, langs.native)
				 	showHints(subs)
                    loadPlayer(videoId, subs)
                })
                break
            }
        }
    })
}

function toggleHintsBox() {
	let h = document.getElementById('hints')
	if (h.style.display === 'none') {
		h.style.display = 'block'
		//player.playVideo()
	} else {
		h.style.display = 'none'
		//player.playVideo()
	}
}

function generateHintsLine(subtitle) {
	let wordRow = [], transRow = [], posRow = []
	subtitle.wordInfos.forEach(wordInfo => {
		wordRow.push(wordInfo.word)
		transRow.push(wordInfo.trans)
		posRow.push(wordInfo.pos)
	})
	let table = '<table border="1">' + getHtmlRow(wordRow, 'showWordInfo(event)') 
	table += getHtmlRow(transRow) + getHtmlRow(posRow) 
	table += '</table>'
	return table
}

function showHints(subs) {
	document.getElementById("content").innerHTML = `
		<div id='wordInfo' style='display: none'>
			<a href='#' onclick='document.getElementById("wordInfo").style.display = "none"'>X</a><br>
			<iframe width='800' height='400'></iframe>
			<iframe width='800' height='400'></iframe>
		</div>
		${subs.map(generateHintsLine).join('<br>')}`
}

function getHtmlRow(cells, linkFunc) {
	let link = linkFunc ? `onclick='${linkFunc}'` : ""
	let cursor = linkFunc ? 'cursor: pointer' : ''
	return `<tr><td ${link} style='text-align: center; ${cursor}'>${cells.join(`</td><td ${link} style="text-align: center; ${cursor}">`)}</td></tr>`
}

function showWordInfo(e) {
	document.getElementById('hints').style.display = 'block'
	let wordInfoBox = document.getElementById('wordInfo')
	wordInfoBox.style.display = 'block'
	let iframes = wordInfoBox.querySelectorAll('iframe')
	iframes[0].src = `https://www.interglot.com/dictionary/en/nl/search/?q=${e.target.innerHTML}`
	iframes[1].src = `https://woordenlijst.org/#/?q=${e.target.innerHTML}`
}

function loadPlayer(videoId) {
	//if (subs) {
	    player = new YT.Player('ytplayer', {
	      height: '90%',
	      width: '100%',
	      videoId: videoId,
	      playerVars: {
	        origin: null,
			rel: 0,
			//cc_load_policy: 1,
			//cc_lang_pref: langs.foreign
	      },
	      events: {
	        onReady: onPlayerReady,
	        onStateChange: playSub
	      }
	    })
	//}
}

function onPlayerReady() {
    player.setPlaybackRate(playbackRate)
}

let userPaused = false

/*
	if pressed play:
	if at subtitle (within 1 sec after):
	- 1. hide subtitle
	- 2. set pause at end of subtitle and beginning of next subtitle
		- display record button, text box, submit
			- onclick record - replace text in text box
			- onclick submit - show subtitle to check answer in text box
	else:
	- 1. pause video
	- 2. seek to start of previous subtitle (or if before first subtitle, fast forward to it)
	- 3. display subtitle
*/

let startMargin = 0.3

function playSub(event) {
	let currentTimeSecs = player.getCurrentTime()
	if (event.data === 1) {	// playing
		if (currentTimeSecs < subs[0].start) {
			//console.log('zero', subs[0].start, currentTimeSecs)
			seekToSubtitleStart(0)
		} else {
			for (let i = 0; i < subs.length; i++) {
				if (currentTimeSecs >= subs[i].start && currentTimeSecs <= (subs[i].start + startMargin)) {
					//console.log('i play', i, subs[i].start, currentTimeSecs)
					setSubtitle("")
					if (i + 1 < subs.length)
						setTimeout(() => {
							//console.log('i stop', i, currentTimeSecs)
							player.pauseVideo()
							setSubtitle(`
								<button onclick="recognition.start()" style="cursor: pointer">🔴</button>
								<input class="textInput" type="text" size="100"></input>
								<button onclick="showSubtitle(this)" style="cursor: pointer">🔤</button>
								<button onclick="playSubtitle()" style="cursor: pointer">🔈</button>
								<div class="result"></div>`)
						}, ((startMargin * 2) + subs[i + 1].start - subs[i].start) * 1000/player.getPlaybackRate())
					break
				} else if (currentTimeSecs < subs[i].start) {
					//console.log('i show', i - 1, subs[i - 1].start, currentTimeSecs)
					seekToSubtitleStart(i - 1)
					break
				}
			}
		}
	}
}

function showSubtitle(btn) {
	if (btn.style.backgroundColor === 'blue') {
		setResultBox("")
		btn.style.backgroundColor = ''
	} else {
		let currentTimeSecs = player.getCurrentTime()
		for (let i = 2; i < subs.length; i++) {
			if (subs[i].start > currentTimeSecs) {
				setResultBox(generateHintsLine(subs[i - 2]))
				btn.style.backgroundColor = 'blue'
				break
			}
		}
	}
}

function playSubtitle() {
	let currentTimeSecs = player.getCurrentTime()
	for (let i = 2; i < subs.length; i++) {
		if (subs[i].start > currentTimeSecs) {
			seekToSubtitleStart(i - 2)
			player.playVideo()
			break
		}
	}
}

function seekToSubtitleStart(subtitleIndex) {
	player.pauseVideo()
	player.seekTo(subs[subtitleIndex].start)
	document.getElementById('subtitle').innerHTML = generateHintsLine(subs[subtitleIndex])
}

function setSubtitle(html) {
	document.getElementById('subtitle').innerHTML = html
}

/*
function playSub1() {
	let elapsedSecs = player.getCurrentTime()
	let nextSubInfo = {}
	for (let i = 0; i < subs.length; i++) {
		if (subs[i].start > elapsedSecs) {
			nextSubInfo.index = i
			nextSubInfo.startAfter = subs[i].start - elapsedSecs
			break	
		}
	}
	let state = JSON.parse(event.data)
	if (state.info === 1) {	// playing
		if (nextSubInfo.index > 0) {
			document.getElementById('subtitle').innerHTML = generateHintsLine(subs[nextSubInfo.index - 1])	
		}
		setTimeout(() => {
			// document.getElementById('subtitle').innerHTML = generateHintsLine(subs[nextSubInfo.index])
			if (userPaused) {
				userPaused = false
			} else {
				player.pauseVideo()
				player.seekTo(subs[nextSubInfo.index - 1].start)
			}
		}, nextSubInfo.startAfter * 1000/player.getPlaybackRate())
	} else if (state.info === 2) {	// paused
		userPaused = true
		player.seekTo(subs[nextSubInfo.index - 1].start)
	}
}
*/

function playNext() {
	
}

//let selfplay = false

function loadSubsNow(event) {
    if (event.data === 1) {	// playing
	    //currentTs = new Date().getTime()
		// if (selfplay) {
// 		  	selfplay = false
// 			setNextSubtitleState()
// 		} else {
// 	        setSubtitleState()
// 		}
		//loadSubtitle(currentTs)
    } else {	// paused, buffering
		if (!selfplay)
        	currentTs = undefined
        //document.getElementById('subtitle').innerHTML = "&nbsp;"
    }
}

//let sentencePause = true

function loadSubtitle(ts) {
	//console.log(JSON.stringify(state))
    setTimeout(() => {
        //if (currentTs === ts) {
			document.getElementById('subtitle').innerHTML = generateHintsLine(subs[state.index]) 
			// getHiddenWordsUI(subs[state.index].wordInfos).join('')
			//selfplay = true
			player.pauseVideo()
			// setTimeout(() => {
			// 	player.playVideo()
				//setNextSubtitleState()
	 	        //loadSubtitle(ts)
			// }, 5000)
        //}
		//sentencePause = !sentencePause
    }, state.startAfter * 1000/player.getPlaybackRate())	
}

function setNextSubtitleState() {
    state.index++
    if (state.index < subs.length) {
        if (state.startNextAfter) {
            state.startAfter = state.startNextAfter
            delete state.startNextAfter
        } else {
            state.startAfter = subs[state.index].start - (state.index === 0 ? 0 : subs[state.index - 1].start)
        }
    }
}

function setSubtitleState() {
    let elapsedSecs = player.getCurrentTime()
    state = {}
    if (subs[0].start > elapsedSecs) {
        state.index = 0
        state.startAfter = subs[0].start - elapsedSecs
    } else {
        for (let i = subs.length - 1; i >= 0; i--) {
			if (subs[i].start < elapsedSecs) {
	            state.index = i
	            state.startAfter = 0
	            if ((i + 1) < subs.length)
	                state.startNextAfter = subs[i + 1].start - elapsedSecs
				break	
			}
        }
    }
}

function getWithTranslationSubs(wordInfos) {
    let htmlText = "", srcRow = "", transRow = ""
    for (let inf of wordInfos) {
        srcRow += `<td>${inf.srcWord}</td>`
        transRow += `<td>${inf.word ? inf.word : ''}</td>`
    }
    if (srcRow.length > 0 || transRow.length > 0)
        htmlText += `<table border="1">${rowify(srcRow)}${rowify(transRow)}</table>`
    return htmlText
}

function rowify(cols) {
    return cols.length > 0 ? `<tr>${cols}</tr>` : ''
}

/*
shownHints - {
  sentence: {},
  word: {},
  ipaLetter: {}
}
*/

function getHiddenWordsUI(wordInfos) {
	let infos = []
	wordInfos.forEach((wordInfo, i) => {
		infos.push(i % 2 === 0 ? wordInfo.word : ' 🤔 ')
	})
	return infos
}

function getReplaceWordsUI(wordInfos, learnedWordsStatic) {
	let wi = []
	for (let wordInfo of wordInfos) {
		wi.push(getReplaceWordUI(wordInfo, learnedWordsStatic))
	}
	return wi
}

function getPictureUI(wordInfos) {
	return _getUI(getPictureUI, wordInfos)
}

function getReplacePronWordsUI(wordInfos) {
	return _getUI(getReplacePronWordUI, wordInfos)
}

function getTooltipsUI(wordInfos) {
	return _getUI(getTooltipUI, wordInfos)
}

function getBracketsUI(wordInfos) {
	return _getUI(getBracketUI, wordInfos)
}

function getWordBoxesUI(wordInfos) {
  return _getUI(getWordBoxUI, wordInfos)
}


function _getUI(uiFunc, wordInfos) {
  return wordInfos.map(uiFunc)
}

function getPictureUI(wordInfo) {
	
}

function showSidebar(body, displayedWords, learnedWordsOnPage, learnedWords) {
	let para = document.createElement('div')
	para.id = "refSidebar"
	para.style = "z-index: 9999999; cellspacing: 5px; font-family: Arial, Helvetica, sans-serif; color: black; overflow: auto; font-size: 20px; position: fixed; top: 0; right: 0; height: 100%; width: 40px; height: 45px; background-color: white"
	para.innerHTML = `<div onclick="let ref = document.getElementById('refSidebar').style; if (ref.width === '300px') { ref.width = '40px'; ref.height = '45px' } else { ref.width = '300px'; ref.height = '100%'}" style="cursor: pointer">
							[<=>]</div>
						<div id="refSidebarStats"></div> 
						<div id="refSidebarContent"></div>`
	body.appendChild(para)
	updateSidebarAndArticle(displayedWords, learnedWordsOnPage, learnedWords)
}

function updateSidebarAndArticle(displayedWords, learnedWordsOnPage, learnedWords) {
	// Update sidebar
	document.getElementById('refSidebarStats').innerHTML = `<br><span style='float: right'>[&nbsp;&nbsp;] ${displayedWords.length} [X] ${Object.keys(learnedWords).length}</span>`
	document.getElementById('refSidebarContent').innerHTML = `<br>${displayedWords.map(toRowStr).join('')}<br>${learnedWordsOnPage.map(toRowStr).join('')}`

	// Update article
	/*
	for (let wordEntry of displayedWords) {
		replaceWord(wordEntry[0], getColoredText(wordEntry[0]), wordEntry[1].trans)
	}
	for (let wordEntry of learnedWordsOnPage) {
		replaceWord(wordEntry[0], getColoredText(wordEntry[0]), '🤔')
	}
	*/
}

function replaceWord(wordId, content, tooltip) {
	wordId = wordIdFormatter(wordId)
	let word = document.querySelector(`[data-langhints-word="${wordId}"]`)
	if (word) {
		word.querySelector(`.content`).innerHTML = content
		word.querySelector(`.tooltiptext`).innerHTML = tooltip
	}
}

function getDispFreqLists(freqTable, learnedWords) {
	let dispFreqTable = Object.entries(freqTable).sort((a, b) => b[1].count - a[1].count)
	let newList = [], learnedList = []
	for (let i = 0; i < dispFreqTable.length; i++) {
		if (dispFreqTable[i][0] !== dispFreqTable[i][1].trans) {
			let isNew = !learnedWords[dispFreqTable[i][0]]
			//addRowStr(dispFreqTable[i], (isNew ? newList : learnedList), isNew)
			let dat = JSON.parse(JSON.stringify(dispFreqTable[i]))
			dat[1].isNew = isNew
			let list = isNew ? newList : learnedList
			list.push(dat)
		}
	}
	return {new: newList, learned: learnedList}
	
}



function toRowStr(wordEntry) {
	return `<div><a href="#" onclick="window.postMessage({word: '${wordEntry[0]}'}, '*')">${wordEntry[1].isNew ? '[&nbsp;&nbsp;]' : '[X]'}</a> ${getColoredText(wordEntry[0])} (${wordEntry[1].count})${wordEntry[1].isNew ? ':' : ''} ${wordEntry[1].isNew ? getTranslation(wordEntry[1]) : ''}</div>`
}

function addRowStr(wordNDef, list, isLive) {
	list.push(`<div><a href="#" onclick="window.postMessage({word: '${wordNDef[0]}'}, '*')">${isLive ? '[&nbsp;&nbsp;]' : '[X]'}</a> ${getColoredText(wordNDef[0])} (${wordNDef[1].count})${isLive ? ':' : ''} ${isLive ? wordNDef[1].trans : ''}</div>`)
}

// ---------------------------------------------------------------

function getReplaceWordUI(wordInfo, learnedWordsStatic) {
		return wordInfo.word !== wordInfo.trans ? ` [${wordInfo.word}] ${wordInfo.trans} ` : ` ${wordInfo.word} `
}

function getWordAndDef2(wordInfo) {
	let transStr = getTranslation(wordInfo)
	return `[${wordInfo.word}] ${transStr.substring(0, 10)}${transStr.length > 10 ? '...' : ''}`
}

function getWordAndDef(wordInfo) {
	let transStr = getTranslation(wordInfo)
	return `[${wordInfo.word}${transStr.length > 0 ? ' | ' : ''}${transStr.substring(0, 10)}${transStr.length > 10 ? '...' : ''}]`
}

function getPlainText(wordInfo) {
	return `[${wordInfo.word}]`
}

function getTooltipText(wordInfo, learnedWordsStatic) {
	return `<span class="tooltipzer" style="font-size: 1.2em;">${getColoredText(wordInfo.word)}<span class="tooltiptext">${learnedWordsStatic[wordInfo.word] ? '🤔' : wordInfo.trans}</span></span>`
}

function getTextPlaceholder(wordInfo) {
	return `<span class="tooltipzer" data-langhints-word="${wordIdFormatter(wordInfo.word)}" style="font-size: 1.2em;"><span class="content"></span><span class="tooltiptext"></span></span>`
}

function getTranslation(wordInfo) {
	return `${wordInfo.word === wordInfo.srcWord ? wordInfo.trans : wordInfo.srcWord}`
}

// ---------------------------------------------------------------

function wordIdFormatter(wordId) {
	return wordId.replace('""', '').replace("'", "")
}

function getColoredText(text) {
	return `<span style='color: #0099BA'>${text}</span>`
	
	let coloredText = ""
	for (let i = 0; i < text.length; i++) {
		let vowelColor
		if (text[i] === 'a' || text[i] === 'ĳ')
			vowelColor = '#009900'
		else if (text[i] === 'e')
			vowelColor = '#0099BA'
		else if (text[i] === 'i')
			vowelColor = '#BB0000'
		else if (text[i] === 'o')
			vowelColor = '#BB5D00'
		else if (text[i] === 'u')
			vowelColor = '#BB5D55'
		coloredText += `<span style='color: ${vowelColor ? vowelColor : "darkslateblue"}'>${text[i]}</span>`
	}
	return coloredText
}

let letterStyle = "font-weight: bold; font-size: 1em; padding: .1em; border-radius: .3em"

function getReplaceWordUIv1(wordInfo) {
	if (wordInfo.word) {
		let text = "", hint = ""
		if (wordInfo.word.text)
			text += wordInfo.word.text
		if (wordInfo.word.trans && wordInfo.word.trans !== wordInfo.word.text) {
			hint += ` <span style="color: grey">[${wordInfo.word.trans}]</span> `
			let newText = "", prevVowel = false, prevN = false
			for (let i = 0; i < text.length; i++) {
				let vowelColor
				if (text[i] === 'a')
					vowelColor = 'coral'
				else if (text[i] === 'e')
					vowelColor = 'deepskyblue'
				else if (text[i] === 'i' || text[i] === 'ĳ')
					vowelColor = 'violet'
				else if (text[i] === 'o')
					vowelColor = 'tan'
				else if (text[i] === 'u')
					vowelColor = 'red'
					
				if (vowelColor) {
					newText += `<span style="${letterStyle} background-color: ${vowelColor}; color: white">${text[i]}</span>`
					prevVowel = true
					prevN = false
				} else {
					newText += `<span style="${letterStyle} background-color: darkblue; color: white;">${text[i]}</span>`
					if ((text[i] === 'n' || isVowel(text[i + 1])) && !prevN && prevVowel && i !== text.length - 1) {
						newText += `<span style="${letterStyle}">‧</span>`
						if (text[i] === 'n') {
							prevN = true
						}
					}
				}
			}
			text = `<span style="font-size: 1.2em;">${newText}</span>`
		}
		return ` ${text}${hint} `
	} else
		return ""
}

function isVowel(letter) {
	return letter === 'a' 
		|| letter === 'e'
		|| letter === 'i'
		|| letter === 'o'
		|| letter === 'u'
		|| letter === 'ĳ'
}

// TODO
// For non-phonetic langs (English, French) or langs with unfamiliar letters
function getReplacePronWordUI(wordInfo) {
	// TODO show word as pronunciation in native lang, and hints as foreign spelling and native translation 
}


function getTooltipUI(wordInfo) {
	if (wordInfo.word) {
		let text = "", tooltip = "", textColor = ""
		if (wordInfo.word.text)
			text += wordInfo.word.text
		if (wordInfo.word.ipaLetters) {
			tooltip += ` ${JSON.stringify(wordInfo.word.ipaLetters.map(ipaLetter => ipaLetter.say).join(' '))} `
		}
		if (wordInfo.word.trans && wordInfo.word.trans !== wordInfo.word.text)
			text += ` <span style="color: grey">[${wordInfo.word.trans}]</span> `
		if (tooltip.length > 0) {
			textColor = ` style="color: green" `
		}
		return ` <span class="tooltipzer" ${textColor}>${text}<span class="tooltiptext">${tooltip}</span></span> `
	} else
		return ""
}

// TODO handle foreign2native
function getBracketUI(wordInfo) {
	if (wordInfo.word) {
		let text = "", brackets = ""
		if (wordInfo.word.text)
			text += wordInfo.word.text
		if (wordInfo.word.ipaLetters) {
			brackets += ` ${JSON.stringify(wordInfo.word.ipaLetters.map(ipaLetter => ipaLetter.say).join(' '))} `
		}
		if (wordInfo.word.trans)
			brackets += ` ${wordInfo.word.trans} `
		if (brackets.length > 0) {
			text = ` <span style="color: green">${text}</span> `
			brackets = ` <span style="color: grey">[${brackets}]</span> `
		}
		return ` ${text} ${brackets} `
	} else
		return ""
}

function getWordBoxUI(wordInfo) {
	return tableWrapper(wordInfo.hints, (wordInfo.word.ipaLetters ? wordInfo.word.ipaLetters.length : undefined))
}

function getIcon(title, icon, type) {
  return `<img title="${title}" src="https://img.icons8.com/${type ? type : 'color'}/26/000000/${icon}.png">`
}

function tdWrapper(content, colspan) {
  let colspanTxt = colspan ? `colspan="${colspan}"` : ''
  return `<td style="text-align: center;  margin: 0; padding: 0; background: white; color: black" ${colspanTxt}>${content}</td>`
}

function tableWrapper(rows, colspan) {
  rows = rows.map(row => {
    if (Array.isArray(row)) {
      return row.map(content => tdWrapper(content)).join('')
    } else { //if (typeof row === "string") {
      return tdWrapper(row, colspan)
    }
  })
  return `<table style="display:inline-table; border: 1px solid lightgrey; margin: 2px; width: auto; height: auto; "><tr">${rows.join('</tr><tr>')}</tr></table>`
}

function getSentenceDisplayHints(sentInfo, shownHints) {
  let words = sentInfo.words
  let wordInfos = []
  for (let word of words) {
    wordInfos.push(getDisplayableWordHints(word, shownHints))	
  }
  return wordInfos
}

function insertLabelsInSentence(sentInfo, shownHints) {
  let words = sentInfo.words
  let wordInfos = []
  let labelledText = ""
  for (let word of words) {
    let hints = getDisplayableWordHints(word, shownHints)
    labelledText += word.text + ' ('
    for (let hint of hints) {
      if (Array.isArray(hint))
        labelledText += `<span>${hint.join('</span>-<span>')}</span> | `
      else if (typeof hint === "string")
        labelledText += `<span>${hint}</span> | `
    }
    labelledText += ') '
  }
  return labelledText
}

function getDisplayableWordHints(word, shownHints) {
	let displayable = {word: JSON.parse(JSON.stringify(word)), hints: []}, hintsCount = 0
  if (shownHints) {
	hintsCount = Object.keys(shownHints.sentence).length + Object.keys(shownHints.word).length + Object.keys(shownHints.ipaLetter).length
	if (word.ipaLetters && word.ipaLetters.length > 0) {
	    let shownIpaLetterHints = shownHints.ipaLetter
	    if (shownIpaLetterHints) {
		  let letterHintsCount = shownIpaLetterHints ? Object.keys(shownHints.ipaLetter).length : 0
		  let actualHintsCount = Object.keys(word.ipaLetters[0]).length
		  letterHintsCount = letterHintsCount < actualHintsCount ? letterHintsCount : actualHintsCount
		  for (let i = 0; i < letterHintsCount; i++) 
			displayable.hints.push([])				
	      for (let ipaLetterInf of word.ipaLetters) {
	        let idx = 0
	        if (shownIpaLetterHints.say && ipaLetterInf.say) {
	          displayable.hints[idx++].push(ipaLetterInf.say)
			}
	        if (shownIpaLetterHints.icon && ipaLetterInf.icon)
	          displayable.hints[idx++].push(getIcon(ipaLetterInf.iconText, ipaLetterInf.icon))
	        if (shownIpaLetterHints.ipa && ipaLetterInf.ipa)
	          displayable.hints[idx++].push(ipaLetterInf.ipa)
	        if (shownIpaLetterHints.type && ipaLetterInf.type) {
	          let typeColor = ipaLetterInf.type ? (ipaLetterInf.type === "vowel" ? 'blue' : 'brown') : ''
	          displayable.hints[idx++].push(`<font color="${typeColor}">${ipaLetterInf.ipa}</font>`)
	        }
	      }
	    }
    }
    let wordHints = shownHints.word
    if (wordHints) {
      if (wordHints.trans && word.trans) {
      	displayable.hints.push(`${(word.trans + "").split(',')[0]}`)
		displayable.hints.push(`${(word.rawTrans + "").split(',')[0]}`)
      } 
      if (wordHints.icon && word.icon) {
		let icon = getIcon(word.text, word.icon)
        displayable.hints.unshift([icon])
		displayable.word.icon = icon
	  }
      if (wordHints.text) {
        displayable.hints.unshift(`<span title="${wordHints.trans ? word.trans : ''}">${word.text}</span>`)
		
	  }
    }
  } else {
    displayable.hints[0] = [`${word.text}`]
  }
  let blanks = hintsCount - displayable.hints.length
  for (let i = 0; i < blanks; i++)
	  displayable.hints.push("<div>&nbsp;</div>")
  return displayable
}