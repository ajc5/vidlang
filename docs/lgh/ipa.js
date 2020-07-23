//------------------------"

// 1. ipa transliteration (or direct?)
// 2. ipa emoji hint (sound colors?)
// 3. ipa mouth shapes (side/front)
// 4. kareoke practice: write/speak in language to match
// 5. word emojis 
// 6. word POS
// 7. translation (by word and phrase)
// TODO ipa letter audio, word audio

let ipaCommon = {
  "æ": {
    audio: "",
    langs: {
      en: {
        icon: "apple",
        iconText: "apple",
        pre: "a",
        say: "ae"
      },
      hi: {
        dep: {
          
        },
        indep: {
          
        }
      }
    }
  },
  "ɑ": {
    langs: {
      en: {
        icon: "flex-biceps",
        iconText: "arm",
        pre: "a",
        say: "a(h)"
      }
    }
  },
  "ɛː": {
    langs: {
      en: {
        icon: "airport",
        iconText: "airplane",
        pre: "a",
        say: "a"
      }
    }
  },
  "e": {
    langs: {
      en: {
        icon: "airport",
        iconText: "airplane",
        pre: "a",
        say: "e(h)"
      }
    }
  }, 
  "h": {
    langs: {
      en: {
        icon: "hummingbird",
        iconText: "hummingbird",
        pre: "h",
        say: "h"
      }
    }
  },
  "i": {
    langs: {
      en: {
        icon: "inbox",
        iconText: "inbox",
        pre: "i",
        say: "e(e)"
      }
    }
  },
  "o": {
    langs: {
      en: {
        icon: "octopus",
        iconText: "octopus",
        pre: "o",
        say: "O"
      }
    }
  },
  "oː": {
    langs: {
      en: {
        icon: "scout-sign",
        iconText: "oath",
        pre: "oa",
        say: "O"
      }
    }
  },
  "y": {
    langs: {
      en: {
        icon: "booger",
        iconText: "ooze",
        pre: "oo",
        say: "oo"
      }
    }
  },
  "w": {
    langs: {
      en: {
        icon: "wine-glass",
        iconText: "wine",
        pre: "w",
        say: "w"
      }
    }
  },
  "x": {
    langs: {
      en: {
        icon: "hummingbird",
        iconText: "hummingbird",
        pre: "h",
        foreign: "nl",
        say: "hg"
      }
    }
  }
}

// https://img.icons8.com/color/26/000000/father.png
let ipa = {
  "ɑ": ipaCommon["ɑ"],
  "a": ipaCommon["ɑ"],
  "æ": ipaCommon["æ"],
  "aː": ipaCommon["æ"],
  "b": {
    langs: {
      en: {
        icon: "butterfly",
        iconText: "butterfly",
        pre: "b",
        say: "b"
      }
    }
  },
  "c": {
    langs: {
      en: {
        icon: "cheese",
        iconText: "cheese",
        pre: "ch",
        say: "ch"
      }
    }
  },
  "d": {
    langs: {
      en: {
        icon: "duck",
        iconText: "duck",
        pre: "d",
        say: "d"
      }
    }
  },
  "e": ipaCommon["e"],
  "ɛ": ipaCommon["e"],
  "ə": ipaCommon["e"],
  "ɛː": ipaCommon["ɛː"],
  "eː": ipaCommon["ɛː"],
  "ɜ": ipaCommon["ə"],
  "ɜː": ipaCommon["ə"],
  "f": {
    langs: {
      en: {
        icon: "baby-feet",
        iconText: "feet",
        pre: "f",
        say: "f"
      }
    }
  },
  "g": {
    langs: {
      en: {
        icon: "year-of-goat",
        iconText: "goat",
        pre: "g",
        say: "g"
      }
    }
  },
  "h": ipaCommon["h"],
  "ɦ": ipaCommon["h"],
  "i": ipaCommon["i"],
  "ɪ": ipaCommon["i"],
  "ɟ": {
    langs: {
      en: {
        icon: "puzzle",
        iconText: "jigsaw",
        pre: "j",
        say: "j"
      }
    }
  },
  "j": {
    langs: {
      en: {
        icon: "sailing",
        iconText: "yacht",
        pre: "y",
        say: "y"
      }
    }
  }, 
  "k": {
    langs: {
      en: {
        icon: "cup",
        iconText: "cup",
        pre: "c",
        say: "c"
      }
    }
  }, 
  "l": {
    langs: {
      en: {
        icon: "lamp",
        iconText: "lamp",
        pre: "l",
        say: "l"
      }
    }
  },
  "m": {
    langs: {
      en: {
        icon: "magnet",
        iconText: "magnet",
        pre: "m",
        say: "m"
      }
    }
  },
  "n": {
    langs: {
      en: {
        icon: "jewelry",
        iconText: "necklace",
        pre: "n",
        say: "n"
      }
    }
  },
  "ɲ": {
    langs: {
      en: {
        icon: "artificial-intelligence",
        iconText: "neural",
        pre: "ne",
        say: "ny"
      }
    }
  }, 
  "ŋ": {
    langs: {
      en: {
        icon: "musical-notes",
        iconText: "so[ng]",
        pre: "ng",
        say: "ng"
      }
    }
  },
  "o": ipaCommon["o"],
  "ɔ": ipaCommon["o"],
  "ø": ipaCommon["o"],
  "oː": ipaCommon["oː"],
  "øː": ipaCommon["oː"],
  "p": {
    langs: {
      en: {
        icon: "beach",
        iconText: "palm",
        pre: "p",
        say: "p"
      }
    }
  },
  "r": {
    langs: {
      en: {
        icon: "robot-2",
        iconText: "robot",
        pre: "r",
        say: "r",
        foreign: "fr"
      }
    }
  },
  "s": {
    langs: {
      en: {
        icon: "socks",
        iconText: "sock",
        pre: "s",
        say: "s"
      }
    }
  },
  "ʃ": {
    langs: {
      en: {
        icon: "trainers",
        iconText: "shoe",
        pre: "sh",
        say: "sh"
      }
    }
  },
  "ʒ": {
    langs: {
      en: {
        icon: "glasses",
        iconText: "vi[si]on",
        pre: "si",
        say: "zh"
      }
    }
  },
  "t": {
    langs: {
      en: {
        icon: "tunnel",
        iconText: "tunnel",
        pre: "t",
        say: "t"
      }
    }
  },
  "θ": {
    langs: {
      en: {
        icon: "temperature",
        iconText: "thermometer",
        pre: "th",
        say: "th"
      }
    }
  },
  "ʏ": {
    langs: {
      en: {
        icon: "up",
        iconText: "up",
        pre: "u",
        say: "u(h)"
      }
    }
  }, 
  "œy": {
    langs: {
      en: {
        icon: "home",
        iconText: "h[ou]se",
        pre: "ou",
        say: "ou"
      }
    }
  },  
  "y": ipaCommon["y"],
  "u": ipaCommon["y"],
  "v": {
    langs: {
      en: {
        icon: "vending-machine",
        iconText: "vending-machine",
        pre: "v",
        say: "v"
      }
    }
  },
  "w": ipaCommon["w"],
  "ʋ": ipaCommon["w"],
  "x": ipaCommon["x"],
  "ɣ": ipaCommon["x"],
  "z": {
    langs: {
      en: {
        icon: "archive",
        iconText: "zip",
        pre: "z",
        say: "z"
      }
    }
  }
}

let ipaLetterType = {
  vowels: {
    "ɑ": true,
    "a": true,
    "aː": true,
    "ɛ": true,
    "e": true,
    "ɛː": true,
    "eː": true,
    "ə": true,
    "ɪ": true,
    "i": true,
    "ɔ": true,
    "o": true,
    "ø": true,
    "øː": true,
    "oː": true,
    "u": true,
    "ʏ": true,
    "œy": true,
    "y": true,
  },
  consonants: {
    "b": true,
    "c": true,
    "d": true,
    "f": true,
    "g": true,
    "ɟ": true,
    "ɦ": true,
    "j": true,
    "k": true,
    "l": true,
    "m": true,
    "n": true,
    "ɲ": true,
    "ŋ": true,
    "p": true,
    "r": true,
    "s": true,
    "ʃ": true,
    "ʒ": true,
    "t": true,
    "v": true,
    "ʋ": true,
    "ɣ": true,
    "x": true,
    "z": true
  }
}

let alphabetTypes = {
  alphasyllabic: {
    hi: true
  },
  alpha: {
    en: true,
    nl: true
  },
  abjad: {
   arabic: true 
  }
}

let visualSpeechPart = {
  "noun": "user",
  "verb": ""
  // etc
}