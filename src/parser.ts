import { stringifyTokenType, Token, TokenType } from "./lexer";
import { Expression } from "./types";
import {
  AssignmentParselet,
  BinaryOperatorParselet,
  ConditionalParselet,
  GroupParselet,
  InfixParselet,
  MethodCallParselet,
  NameParselet,
  PostfixOperatorParselet,
  Precedence,
  PrefixOperatorParselet,
  PrefixParselet,
} from "./parselet";

export class Parser {
  tokens: Token[];
  idx: number = 0;

  prefixParselets: Partial<Record<TokenType, PrefixParselet>> = {};
  infixParselets: Partial<Record<TokenType, InfixParselet>> = {};

  constructor(tokens: Token[]) {
    this.registerPrefix(TokenType.NAME, new NameParselet());
    this.registerPrefix(TokenType.LEFT_PAREN, new GroupParselet());

    this.registerInfix(TokenType.QUESTION, new ConditionalParselet());
    this.registerInfix(TokenType.LEFT_PAREN, new MethodCallParselet());
    this.registerInfix(TokenType.ASSIGN, new AssignmentParselet());

    this.prefix(TokenType.PLUS, Precedence.PREFIX);
    this.prefix(TokenType.MINUS, Precedence.PREFIX);
    this.prefix(TokenType.TILDE, Precedence.PREFIX);
    this.prefix(TokenType.BANG, Precedence.PREFIX);

    this.binary(TokenType.PLUS, Precedence.SUM);
    this.binary(TokenType.MINUS, Precedence.SUM);
    this.binary(TokenType.ASTERISK, Precedence.PRODUCT);
    this.binary(TokenType.SLASH, Precedence.PRODUCT);
    this.binary(TokenType.CARET, Precedence.EXPONENT, true);

    this.postfix(TokenType.BANG, Precedence.POSTFIX);

    this.tokens = tokens;
  }

  binary = (
    tokenType: TokenType,
    precedence: Precedence,
    isRightAssociative: boolean = false,
  ) => {
    this.registerInfix(
      tokenType,
      new BinaryOperatorParselet(precedence, isRightAssociative),
    );
  };

  postfix = (tokenType: TokenType, precedence: Precedence) => {
    this.registerInfix(tokenType, new PostfixOperatorParselet(precedence));
  };

  consume = (expectedType?: TokenType) => {
    const token = this.tokens[this.idx++];

    if (expectedType === undefined || token.type === expectedType) return token;

    throw new Error(
      `Expected ${stringifyTokenType(expectedType)} but instead found ${stringifyTokenType(token.type)}.`,
    );
  };

  peek = (offset: number = 0) => {
    return this.tokens[this.idx + offset];
  };

  registerPrefix = (tokenType: TokenType, prefixParselet: PrefixParselet) => {
    this.prefixParselets[tokenType] = prefixParselet;
  };

  registerInfix = (tokenType: TokenType, infixParselet: InfixParselet) => {
    this.infixParselets[tokenType] = infixParselet;
  };

  prefix = (prefix: TokenType, precedence: number) => {
    this.registerPrefix(prefix, new PrefixOperatorParselet(precedence));
  };

  getPrecedence = (): number => {
    const token = this.peek();
    const parselet = this.infixParselets[token.type];

    if (parselet !== undefined) {
      return parselet.getPrecedence();
    }

    return 0;
  };

  match = (tokenType: TokenType) => {
    // return this.peek().type === tokenType ? !!this.consume() : false

    const isMatch = this.peek().type === tokenType;

    if (!isMatch) {
      return isMatch;
    }

    this.consume();

    return isMatch;
  };

  parse = (): Expression => {
    const ast = this.parseExpression();
    const maybeEof = this.peek();

    if (maybeEof.type === TokenType.EOF) return ast;

    throw new Error(`Expected EOF but instead found ${maybeEof.text}.`);
  };

  parseExpression = (precedence: number = 0): Expression => {
    let token = this.consume();

    const prefix = this.prefixParselets[token.type];

    if (prefix === undefined) throw new Error(`Could not parse ${token.text}.`);

    let left = prefix.parse(this, token);

    while (precedence < this.getPrecedence()) {
      token = this.consume();

      const infix = this.infixParselets[token.type]!;
      left = infix.parse(this, left, token);
    }

    return left;
  };
}
