export interface ParsedYear {
  raw: string;
  year: number | null;
  isDecadeSuggestion: boolean;
  isUncertain: boolean;
}

const year_re = /^(\d{4})(S)?(\?)?$|^(\d{4})(\?)?(S)?$/;

export const parseYearToken = (token: string): ParsedYear => {
  const match = token.match(year_re);
  if (!match) {
    return {
      raw: token,
      year: null,
      isDecadeSuggestion: false,
      isUncertain: false,
    };
  }
  const year = Number(match[1] ?? match[4]);
  const isDecadeSuggestion = Boolean(match[2] ?? match[6]);
  const isUncertain = Boolean(match[3] ?? match[5]);
  return { raw: token, year, isDecadeSuggestion, isUncertain };
};

export interface ParsedTitleKey {
  raw: string;
  authenticity: string | null;
  year: number | null;
  yearRaw: string | null;
  yearIsDecadeSuggestion: boolean;
  yearIsUncertain: boolean;
  relationshipCode: string | null;
  correspondentCode: string | null;
  parseOk: boolean;
}

export const parseTitleKey = (
  titleKey: string | null | undefined,
): ParsedTitleKey => {
  const raw = titleKey ?? "";
  const empty: ParsedTitleKey = {
    raw,
    authenticity: null,
    year: null,
    yearRaw: null,
    yearIsDecadeSuggestion: false,
    yearIsUncertain: false,
    relationshipCode: null,
    correspondentCode: null,
    parseOk: false,
  };

  if (!raw.trim()) return empty;

  const tokens = raw.trim().split(/\s+/);
  if (tokens.length < 4) return empty;

  const [authenticity, yearToken, relationshipCode, ...rest] = tokens;
  const correspondentCode = rest.join(" ");

  if (typeof authenticity !== "string") return empty;
  if (typeof relationshipCode !== "string") return empty;
  if (typeof correspondentCode !== "string") return empty;
  if (typeof yearToken !== "string") return empty;

  const parsedYear = parseYearToken(yearToken);

  return {
    raw,
    authenticity,
    year: parsedYear.year,
    yearRaw: parsedYear.raw,
    yearIsDecadeSuggestion: parsedYear.isDecadeSuggestion,
    yearIsUncertain: parsedYear.isUncertain,
    relationshipCode,
    correspondentCode,
    parseOk: parsedYear.year !== null,
  };
};
