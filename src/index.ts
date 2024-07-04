import { test } from "./utilities";

/** -- Function Call -- **/

test("a()", "a()");
test("a(b)", "a(b)");
test("a(b, c)", "a(b, c)");
test("a(b)(c)", "a(b)(c)");
test("a(b) + c(d)", "(a(b) + c(d))");
test("a(b ? c : d, e + f)", "a((b ? c : d), (e + f))");

/** -- Unary Precedence -- **/

test("~!-+a", "(~(!(-(+a))))");
test("a!!!", "(((a!)!)!)");

/** -- Binary Precedence -- **/

test("a = b + c * d ^ e - f / g", "(a = ((b + (c * (d ^ e))) - (f / g)))");

/** -- Binary Associativity -- **/

test("a = b = c", "(a = (b = c))");
test("a + b - c", "((a + b) - c)");
test("a * b / c", "((a * b) / c)");
test("a ^ b ^ c", "(a ^ (b ^ c))");

/** -- Conditional Operator -- **/

test("a ? b : c ? d : e", "(a ? b : (c ? d : e))");
test("a ? b ? c : d : e", "(a ? (b ? c : d) : e)");
test("a + b ? c * d : e / f", "((a + b) ? (c * d) : (e / f))");

/** -- Grouping -- **/

test("a + (b + c) + d", "((a + (b + c)) + d)");
test("a ^ (b + c)", "(a ^ (b + c))");
test("(!a)!", "((!a)!)");
