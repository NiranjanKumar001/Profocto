// Simple resume analysis utilities: keyword matching, suggestions, translation stub, scoring

export type AnalysisResult = {
  suggestions: string[];
  missingSkills: string[];
  keywordMatches: { [keyword: string]: number };
  score: number;
};

const IMPORTANT_SKILLS = [
  'communication',
  'teamwork',
  'leadership',
  'javascript',
  'typescript',
  'react',
  'node',
  'python',
  'sql',
  'aws',
  'docker',
  'kubernetes',
  'testing',
];

function normalize(text = '') {
  return text.toLowerCase();
}

export function analyzeResumeText(text: string, resumeSkills: string[] = []): AnalysisResult {
  const norm = normalize(text);
  const suggestions: string[] = [];
  const missingSkills: string[] = [];
  const keywordMatches: { [keyword: string]: number } = {};

  // Count occurrences of important keywords
  let totalMatches = 0;
  for (const kw of IMPORTANT_SKILLS) {
    const re = new RegExp(`\\b${kw}\\b`, 'gi');
    const m = (norm.match(re) || []).length;
    if (m > 0) {
      keywordMatches[kw] = m;
      totalMatches += m;
    }
  }

  // Suggest adding skills that are in IMPORTANT_SKILLS but not present in resumeSkills
  const lowerResumeSkills = resumeSkills.map((s) => s.toLowerCase());
  for (const kw of IMPORTANT_SKILLS) {
    if (!lowerResumeSkills.includes(kw) && !norm.includes(kw)) {
      missingSkills.push(kw);
    }
  }

  // Simple phrasing suggestions based on presence of passive phrases
  if (/responsible for|worked on|did|helped with/.test(norm)) {
    suggestions.push('Use active verbs and quantify achievements (e.g. "Led X, resulting in Y").');
  }

  if (!/achiev|result|improv|increas|reduc/.test(norm)) {
    suggestions.push('Add quantifiable achievements (percentages, numbers, metrics).');
  }

  // Grammar/length check simple
  const wordCount = (norm.split(/\s+/).filter(Boolean) || []).length;
  if (wordCount < 50) {
    suggestions.push('Consider adding more detail to your summary or experience sections.');
  }

  // Score calculation: base 50 + matching keywords*3 + (wordCount/5)
  let score = 50 + Math.min(30, totalMatches * 3) + Math.min(20, Math.floor(wordCount / 5));
  if (score > 100) score = 100;

  // Provide a small prioritized suggestion list
  if (missingSkills.length > 0) {
    suggestions.push(`Consider adding skills: ${missingSkills.slice(0, 5).join(', ')}.`);
  }

  return {
    suggestions,
    missingSkills,
    keywordMatches,
    score,
  };
}

export function analyzeJobDescription(jobText: string, resumeSkills: string[] = []) {
  const norm = normalize(jobText);
  const jdKeywords = IMPORTANT_SKILLS.filter((kw) => norm.includes(kw));
  const matched = jdKeywords.filter((k) => resumeSkills.map((s) => s.toLowerCase()).includes(k));
  const matchPercent = jdKeywords.length === 0 ? 0 : Math.round((matched.length / jdKeywords.length) * 100);
  const missing = jdKeywords.filter((k) => !matched.includes(k));
  return {
    jdKeywords,
    matched,
    missing,
    matchPercent,
  };
}

// Translation stub - in real app you'd integrate an API like LibreTranslate or DeepL
export async function translateText(text: string, targetLang: string) {
  // For now, return the original text and a tag saying "[translated]"
  return `[${targetLang}] ${text}`;
}
