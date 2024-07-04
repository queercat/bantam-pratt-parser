export enum TokenType {
  LEFT_PAREN,
  RIGHT_PAREN,
  COMMA,
  ASSIGN,
  PLUS,
  MINUS,
  ASTERISK,
  SLASH,
  CARET,
  TILDE,
  BANG,
  QUESTION,
  COLON,
  NAME,
  EOF,
}

export class Token {
  text: string;
  type: TokenType;

  constructor(text: string, tokenType: TokenType) {
    this.text = text;
    this.type = tokenType;
  }
}

const isUnary = (character: string) => {
  return {
    "+": TokenType.PLUS,
    "*": TokenType.ASTERISK,
    "-": TokenType.MINUS,
    "~": TokenType.TILDE,
    "!": TokenType.BANG,
    "(": TokenType.LEFT_PAREN,
    ")": TokenType.RIGHT_PAREN,
    ",": TokenType.COMMA,
    ":": TokenType.COLON,
    "?": TokenType.QUESTION,
    "/": TokenType.SLASH,
    "^": TokenType.CARET,
    "=": TokenType.ASSIGN,
  }[character];
};

export const stringifyTokenType = (tokenType: TokenType) => {
  switch (tokenType) {
    case TokenType.ASSIGN:
      return "=";
    case TokenType.ASTERISK:
      return "*";
    case TokenType.BANG:
      return "!";
    case TokenType.CARET:
      return "^";
    case TokenType.COLON:
      return ":";
    case TokenType.COMMA:
      return ",";
    case TokenType.EOF:
      return "<EOF>";
    case TokenType.LEFT_PAREN:
      return "(";
    case TokenType.MINUS:
      return "-";
    case TokenType.NAME:
      return "NAME";
    case TokenType.PLUS:
      return "+";
    case TokenType.QUESTION:
      return "?";
    case TokenType.RIGHT_PAREN:
      return ")";
    case TokenType.SLASH:
      return "/";
    case TokenType.TILDE:
      return "~";
  }
};

const isLetter = (character: string) => {
  const validator = /[a-zA-Z]/i;

  return validator[Symbol.match](character);
};

export const lex = (source: string): Token[] => {
  let idx = 0;

  const tokens: Token[] = [];

  while (idx < source.length) {
    let character = source[idx++];

    const unaryResult = isUnary(character);

    if (unaryResult !== undefined) {
      tokens.push(new Token(character, unaryResult));
    } else if (isLetter(character)) {
      const start = idx - 1;

      while (idx < source.length) {
        if (!isLetter(source[idx])) break;
        idx++;
      }

      const end = idx;
      const text = source.substring(start, end);

      tokens.push(new Token(text, TokenType.NAME));
    }
  }

  tokens.push(new Token("", TokenType.EOF));

  return tokens;
};
