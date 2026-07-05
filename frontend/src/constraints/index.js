export const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Russian", "Chinese", "Japanese", "Korean", "Arabic", "Hindi",
  "Turkish", "Dutch", "Polish", "Swedish", "Norwegian", "Danish",
  "Finnish", "Greek", "Czech", "Romanian", "Hungarian", "Ukrainian",
]

export const SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#",
  "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin",
  "React", "Vue", "Angular", "Next.js", "Node.js", "Express",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes",
  "AWS", "Azure", "GCP", "Git", "Linux", "GraphQL",
]

export const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe",
  "black", "luxury", "dracula", "cmyk", "autumn", "business",
  "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"
]

const LANGUAGE_TO_COUNTRY = {
  "English": "US",
  "Spanish": "ES",
  "French": "FR",
  "German": "DE",
  "Italian": "IT",
  "Portuguese": "PT",
  "Russian": "RU",
  "Chinese": "CN",
  "Japanese": "JP",
  "Korean": "KR",
  "Arabic": "SA",
  "Hindi": "IN",
  "Turkish": "TR",
  "Dutch": "NL",
  "Polish": "PL",
  "Swedish": "SE",
  "Norwegian": "NO",
  "Danish": "DK",
  "Finnish": "FI",
  "Greek": "GR",
  "Czech": "CZ",
  "Romanian": "RO",
  "Hungarian": "HU",
  "Ukrainian": "UA",
}

export const getCountryFlag = (language) => {
  const countryCode = LANGUAGE_TO_COUNTRY[language]
  if (!countryCode) return "🏳️"
  return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
}
