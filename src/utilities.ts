import * as process from "node:process";
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
import { lex, stringifyTokenType } from "./lexer";
import { Parser } from "./parser";

const prettyPrint = (ast: Expression): string => {
  if (ast instanceof NameExpression) {
    return `${ast.name}`;
  } else if (ast instanceof PrefixExpression) {
    return `(${stringifyTokenType(ast.operator)}${prettyPrint(ast.expression)})`;
  } else if (ast instanceof OperatorExpression) {
    return `(${prettyPrint(ast.left)} ${stringifyTokenType(ast.operator)} ${prettyPrint(ast.right)})`;
  } else if (ast instanceof PostfixExpression) {
    return `(${prettyPrint(ast.left)}${stringifyTokenType(ast.operator)})`;
  } else if (ast instanceof ConditionalExpression) {
    return `(${prettyPrint(ast.conditional)} ? ${prettyPrint(ast.leftArm)} : ${prettyPrint(ast.rightArm)})`;
  } else if (ast instanceof MethodCallExpression) {
    return `${prettyPrint(ast.method)}(${ast.argumentz.map((a) => prettyPrint(a)).join(", ")})`;
  } else if (ast instanceof AssignmentExpression) {
    return `(${prettyPrint(ast.left)} = ${prettyPrint(ast.right)})`;
  }

  throw new Error(`Invalid AST node ${ast}`);
};

export const test = (source: string, expected: string) => {
  const parser = new Parser(lex(source));
  const expression = parser.parse();
  const prettyPrinted = prettyPrint(expression);

  if (prettyPrinted !== expected)
    console.log(
      `\x1b[41m`,
      `[FAIL]: expected: \`${expected}\` but instead found \`${prettyPrinted}\``,
    );
  else
    console.log(`\x1b[32m`, `[PASS]: \`${prettyPrinted}\` === \`${expected}\``);

  // Reset color.
  process.stdout.write("\x1b[0m");
};
