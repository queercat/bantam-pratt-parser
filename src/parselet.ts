import {
  AssignmentExpression,
  ConditionalExpression,
  Expression,
  MethodCallExpression,
  NameExpression,
  OperatorExpression,
  PostfixExpression,
  PrefixExpression,
} from "./types";
import { Parser } from "./parser";
import { Token, TokenType } from "./lexer";

export enum Precedence {
  NOTHINGBURGER,
  ASSIGNMENT,
  CONDITIONAL,
  SUM,
  PRODUCT,
  EXPONENT,
  PREFIX,
  POSTFIX,
  CALL,
}

/** -- Prefix -- **/

export interface PrefixParselet {
  parse(parser: Parser, token: Token): Expression;
}

export class NameParselet implements PrefixParselet {
  parse(parser: Parser, token: Token): Expression {
    return new NameExpression(token.text);
  }
}

export class PrefixOperatorParselet implements PrefixParselet {
  parse(parser: Parser, token: Token): Expression {
    return new PrefixExpression(
      token.type,
      parser.parseExpression(this.precedence),
    );
  }

  getPrecedence(): number {
    return this.precedence;
  }

  precedence: number;

  constructor(precedence: number) {
    this.precedence = precedence;
  }
}

export class GroupParselet implements PrefixParselet {
  parse(parser: Parser, token: Token): Expression {
    const expression = parser.parseExpression(parser.getPrecedence());
    parser.consume(TokenType.RIGHT_PAREN);

    return expression;
  }
}

/** -- Infix -- **/

export interface InfixParselet {
  parse(parser: Parser, left: Expression, token: Token): Expression;
  getPrecedence(): number;
}

export class BinaryOperatorParselet implements InfixParselet {
  parse(parser: Parser, left: Expression, token: Token): Expression {
    return new OperatorExpression(
      left,
      token.type,
      parser.parseExpression(
        this.precedence - (this.isRightAssociative ? 1 : 0),
      ),
    );
  }

  getPrecedence(): number {
    return this.precedence;
  }

  precedence: number;
  isRightAssociative: boolean;

  constructor(precedence: number, isRightAssociative: boolean) {
    this.precedence = precedence;
    this.isRightAssociative = isRightAssociative;
  }
}

export class MethodCallParselet implements InfixParselet {
  parse(parser: Parser, left: Expression, token: Token): Expression {
    const argumentz: Expression[] = [];

    while (!parser.match(TokenType.RIGHT_PAREN)) {
      do {
        argumentz.push(parser.parseExpression());
      } while (parser.match(TokenType.COMMA));
    }

    return new MethodCallExpression(left, argumentz);
  }

  getPrecedence(): number {
    return Precedence.CALL;
  }
}

export class AssignmentParselet implements InfixParselet {
  parse(parser: Parser, left: Expression, token: Token): Expression {
    return new AssignmentExpression(
      left,
      parser.parseExpression(Precedence.ASSIGNMENT - 1),
    );
  }

  getPrecedence(): number {
    return Precedence.ASSIGNMENT;
  }
}

/** -- Postfix -- **/

export class PostfixOperatorParselet implements InfixParselet {
  parse(parser: Parser, left: Expression, token: Token): Expression {
    return new PostfixExpression(left, token.type);
  }

  getPrecedence(): number {
    return this.precedence;
  }

  precedence: number;

  constructor(precedence: number) {
    this.precedence = precedence;
  }
}

/** -- Mixfix -- **/

export class ConditionalParselet implements InfixParselet {
  parse(parser: Parser, left: Expression, token: Token): Expression {
    const conditional = left;

    const leftArm = parser.parseExpression();
    parser.consume(TokenType.COLON);
    const rightArm = parser.parseExpression(Precedence.CONDITIONAL - 1);

    return new ConditionalExpression(conditional, leftArm, rightArm);
  }

  getPrecedence(): number {
    return Precedence.CONDITIONAL;
  }
}
