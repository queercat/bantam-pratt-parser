import { TokenType } from "./lexer";

export class Expression {}

export class NameExpression extends Expression {
  name: string;

  constructor(name: string) {
    super();

    this.name = name;
  }
}

export class MethodCallExpression extends Expression {
  method: Expression;
  argumentz: Expression[];

  constructor(method: Expression, argumentz: Expression[]) {
    super();

    this.method = method;
    this.argumentz = argumentz;
  }
}

export class PrefixExpression extends Expression {
  operator: TokenType;
  expression: Expression;

  constructor(operator: TokenType, expression: Expression) {
    super();

    this.operator = operator;
    this.expression = expression;
  }
}

export class OperatorExpression extends Expression {
  left: Expression;
  operator: TokenType;
  right: Expression;

  constructor(left: Expression, operator: TokenType, right: Expression) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

export class PostfixExpression extends Expression {
  left: Expression;
  operator: TokenType;

  constructor(left: Expression, operator: TokenType) {
    super();

    this.left = left;
    this.operator = operator;
  }
}

export class ConditionalExpression extends Expression {
  conditional: Expression;
  leftArm: Expression;
  rightArm: Expression;

  constructor(
    conditional: Expression,
    leftArm: Expression,
    rightArm: Expression,
  ) {
    super();

    this.conditional = conditional;
    this.leftArm = leftArm;
    this.rightArm = rightArm;
  }
}

export class AssignmentExpression extends Expression {
  left: Expression;
  right: Expression;

  constructor(left: Expression, right: Expression) {
    super();

    this.left = left;
    this.right = right;
  }
}
