
export const EMOJI = {
  tada: String.fromCodePoint(127881),
  trophy: String.fromCodePoint(127942),
  speaker: String.fromCodePoint(128264),
  tamtam: String.fromCodePoint(129688),
  question: String.fromCodePoint(10067)
};

export const FOOD_EMOJI = {
  avocado: String.fromCodePoint(129361),
  banana: String.fromCodePoint(127820),
  coconut: String.fromCodePoint(129381),
  corn: String.fromCodePoint(127805),
  mango: String.fromCodePoint(129389),
  peanut: String.fromCodePoint(129372),
  pineapple: String.fromCodePoint(127821)
};

export const TRANSPORT_EMOJI = {
  airplane: String.fromCodePoint(9992, 65039),
  canoe: String.fromCodePoint(128758),
  helicopter: String.fromCodePoint(128641),
};

/*
  (not working) u'xyz' to indicate a Unicode string, a sequence of Unicode characters
  (working) '\uxxxx' to indicate a string with a unicode character denoted by four hex digits
  (not working) '\Uxxxxxxxx' to indicate a string with a unicode character denoted by eight hex digits
  */
// Unicode range for flags: u'[\U0001F1E6-\U0001F1FF]
export const FLAG_BANK = {
  eg: String.fromCodePoint(127466, 127468),

  // Cote d'Ivoire
  ci: String.fromCodePoint(127464, 127470),

  // Cameroun
  cm: String.fromCodePoint(127464, 127474),

  // Ghana
  gh: String.fromCodePoint(127468, 127469),

  // Nigeria
  ng: String.fromCodePoint(127475, 127468),

  // Algerie
  dz: String.fromCodePoint(127465, 127487),

  // RDC
  cd: String.fromCodePoint(127464, 127465),

  // Zambie
  zm: String.fromCodePoint(127487, 127474),

  // Soudan
  sd: String.fromCodePoint(127480, 127465),

  // Tunisie
  tn: String.fromCodePoint(127481, 127475),

  // Senegal
  sn: String.fromCodePoint(127480, 127475),

  // Ethiopie
  et: String.fromCodePoint(127466, 127481),

  // Maroc
  ma: String.fromCodePoint(127474, 127462),

  // Afrique du Sud
  za: String.fromCodePoint(127487, 127462),

  // Congo (Brazzaville)
  cg: String.fromCodePoint(127464, 127468),
};
