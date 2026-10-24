export type ElifbaWord = { text: string; emoji: string; meaning: string; translit: string };

export type ElifbaLetter = {
  id: string;
  char: string;
  name: string;
  nameAr: string;
  sound: string;
  // Letters that do not join the next letter (ا د ذ ر ز و).
  joins: boolean;
  word: ElifbaWord;
};

const ar = (
  id: string,
  char: string,
  name: string,
  nameAr: string,
  sound: string,
  word: [text: string, translit: string, meaning: string, emoji: string],
  joins = true,
): ElifbaLetter => ({
  id,
  char,
  name,
  nameAr,
  sound,
  joins,
  word: { text: word[0], translit: word[1], meaning: word[2], emoji: word[3] },
});

export const ELIFBA: ElifbaLetter[] = [
  ar("elif", "ا", "Elif", "أَلِف", "a e gjatë; vetë nuk ka zë, e zgjat zanoren", ["أَسَد", "esed", "Luan", "🦁"], false),
  ar("ba", "ب", "Ba", "بَاء", "b", ["بَيْت", "bejt", "Shtëpi", "🏠"]),
  ar("ta", "ت", "Ta", "تَاء", "t", ["تُفَّاح", "tuffah", "Mollë", "🍎"]),
  ar("tha", "ث", "Tha", "ثَاء", "th, si te fjala “thikë”", ["ثَعْلَب", "tha‘leb", "Dhelpër", "🦊"]),
  ar("xhim", "ج", "Xhim", "جِيم", "xh, si te fjala “xhami”", ["جَمَل", "xhemel", "Deve", "🐫"]),
  ar("ha", "ح", "Ha", "حَاء", "h e fortë, nga mesi i fytit", ["حِصَان", "hisan", "Kalë", "🐎"]),
  ar("kha", "خ", "Kha", "خَاء", "h e trashë, nga fundi i fytit", ["خُبْز", "hubz", "Bukë", "🍞"]),
  ar("dal", "د", "Dal", "دَال", "d", ["دُبّ", "dubb", "Ari", "🐻"], false),
  ar("dhal", "ذ", "Dhal", "ذَال", "dh, si te fjala “dhelpër”", ["ذِئْب", "dhi’b", "Ujk", "🐺"], false),
  ar("ra", "ر", "Ra", "رَاء", "r", ["رَجُل", "rexhul", "Burrë", "👨"], false),
  ar("zaj", "ز", "Zaj", "زَاي", "z", ["زَرَافَة", "zerafe", "Gjirafë", "🦒"], false),
  ar("sin", "س", "Sin", "سِين", "s", ["سَمَك", "semek", "Peshk", "🐟"]),
  ar("shin", "ش", "Shin", "شِين", "sh", ["شَمْس", "shems", "Diell", "☀️"]),
  ar("sad", "ص", "Sad", "صَاد", "s e trashë", ["صَقْر", "sakr", "Skifter", "🦅"]),
  ar("dad", "ض", "Dad", "ضَاد", "d e trashë", ["ضِفْدَع", "difda‘", "Bretkosë", "🐸"]),
  ar("ta2", "ط", "Ṭa", "طَاء", "t e trashë", ["طَائِرَة", "ta’ire", "Aeroplan", "✈️"]),
  ar("za", "ظ", "Ẓa", "ظَاء", "dh e trashë", ["ظَرْف", "dharf", "Zarf", "✉️"]),
  ar("ajn", "ع", "Ajn", "عَيْن", "zë i thellë nga fyti, nuk ka në shqip", ["عَيْن", "‘ajn", "Sy", "👁️"]),
  ar("gajn", "غ", "Gajn", "غَيْن", "g e trashë, e ngjashme me r-në franceze", ["غَيْمَة", "gajme", "Re", "☁️"]),
  ar("fa", "ف", "Fa", "فَاء", "f", ["فِيل", "fil", "Elefant", "🐘"]),
  ar("kaf", "ق", "Kaf", "قَاف", "k e thellë, nga fundi i gojës", ["قَمَر", "kamer", "Hënë", "🌙"]),
  ar("kef", "ك", "Kef", "كَاف", "k", ["كِتَاب", "kitab", "Libër", "📖"]),
  ar("lam", "ل", "Lam", "لَام", "l", ["لَيْمُون", "lejmun", "Limon", "🍋"]),
  ar("mim", "م", "Mim", "مِيم", "m", ["مَسْجِد", "mesxhid", "Xhami", "🕌"]),
  ar("nun", "ن", "Nun", "نُون", "n", ["نَحْلَة", "nahle", "Bletë", "🐝"]),
  ar("he", "ه", "He", "هَاء", "h e lehtë", ["هِلَال", "hilal", "Hëna e re", "🌒"]),
  ar("vav", "و", "Vav", "وَاو", "v, ose u e gjatë", ["وَرْدَة", "verde", "Trëndafil", "🌹"], false),
  ar("ja", "ي", "Ja", "يَاء", "j, ose i e gjatë", ["يَد", "jed", "Dorë", "✋"]),
];

const TATWEEL = "ـ";

// Isolated, initial, medial and final forms, drawn by the font through joining with a tatweel.
export function letterForms(letter: ElifbaLetter) {
  const c = letter.char;
  return [
    { label: "Veçmas", text: c },
    { label: "Në fillim", text: letter.joins ? `${c}${TATWEEL}` : c },
    { label: "Në mes", text: letter.joins ? `${TATWEEL}${c}${TATWEEL}` : `${TATWEEL}${c}` },
    { label: "Në fund", text: `${TATWEEL}${c}` },
  ];
}
