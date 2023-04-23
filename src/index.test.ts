
import {
	isBetween,
	isBoolean,
	isEqual,
	isIn,
	isInstanceOf,
	isInteger,
	isInUnion,
	isLiteral,
	isNotEmpty,
	isNotNull,
	isNumber,
	isTrue,
	isValid,
	isValidDate,
	noNullElements,
	notThrowing,
} from ".";

describe("Validation", () => {
	it("no null elements detects undefined", async () => {
		expect(() => noNullElements(undefined)).toThrow();
	});

	it("no null elements detects null", async () => {
		expect(() => noNullElements(null as unknown as undefined)).toThrow();
	});

	it("no null elements detects number", async () => {
		expect(() => noNullElements(5040 as unknown as undefined)).toThrow("Value was not array or contained null items.");
	});

	it("no null elements detects object", async () => {
		expect(() => noNullElements({} as unknown as undefined)).toThrow("Value was not array or contained null items.");
	});

	it("no null elements detects null element", async () => {
		expect(() => noNullElements([null])).toThrow();
	});

	it("no null elements detects undefined element", async () => {
		expect(() => noNullElements([undefined])).toThrow();
	});

	it("no null elements allows empty string element", async () => {
		expect(() => noNullElements([""])).not.toThrow();
	});

	it("no null elements allows string element", async () => {
		expect(() => noNullElements(["hello"])).not.toThrow();
	});

	it("not null asserts not null on value: T | null", async () => {
		const maybeNull = new Date() as Date | null;
		const notNull = isNotNull(maybeNull);
		void notNull.toISOString();
	});

	it("not null detects null", async () => {
		expect(() => isNotNull(null)).toThrow();
	});

	it("not null detects undefined", async () => {
		expect(() => isNotNull(undefined)).toThrow();
	});

	it("not null allows empty string", async () => {
		expect(() => isNotNull("")).not.toThrow();
	});

	it("not null allows zero", async () => {
		expect(() => isNotNull(0)).not.toThrow();
	});

	it("is boolean detects null", async () => {
		expect(() => isBoolean(null)).toThrow();
	});

	it("is boolean detects undefined", async () => {
		expect(() => isBoolean(undefined)).toThrow();
	});

	it("is boolean detects number", async () => {
		expect(() => isBoolean(5040 as unknown as boolean)).toThrow();
	});

	it("is boolean detects string", async () => {
		expect(() => isBoolean("hello" as unknown as boolean)).toThrow();
	});

	it('is boolean detects "true" and "false"', async () => {
		expect(() => isBoolean("true" as unknown as boolean)).toThrow();
		expect(() => isBoolean("false" as unknown as boolean)).toThrow();
	});

	it("is boolean detects object", async () => {
		expect(() => isBoolean({ h: "hello" } as unknown as boolean)).toThrow();
	});

	it("is boolean allows true", async () => {
		expect(() => isBoolean(true)).not.toThrow();
	});

	it("is boolean allows false", async () => {
		expect(() => isBoolean(false)).not.toThrow();
	});

	it("is boolean returns the value false", async () => {
		expect(isBoolean(false)).toEqual(false);
	});

	it("is boolean returns the value true", async () => {
		expect(isBoolean(true)).toEqual(true);
	});

	it("is number detects null", async () => {
		expect(() => isNumber(null)).toThrow();
	});

	it("is number detects undefined", async () => {
		expect(() => isNumber(undefined)).toThrow();
	});

	it("is number detects empty strings", async () => {
		expect(() => isNumber("")).toThrow();
	});

	it("is number allows integer strings", async () => {
		expect(() => isNumber("123")).not.toThrow();
	});

	it("is number allows float strings", async () => {
		expect(() => isNumber("123.123")).not.toThrow();
	});

	it("is number allows numbers", async () => {
		expect(() => isNumber(123.123)).not.toThrow();
	});

	it("is integer detects null", async () => {
		expect(() => isInteger(null)).toThrow();
	});

	it("is integer detects undefined", async () => {
		expect(() => isInteger(undefined)).toThrow();
	});

	it("is integer detects integer strings", async () => {
		expect(() => isInteger("10" as unknown as number)).toThrow();
	});

	it("is integer detects floating point numbers", async () => {
		expect(() => isInteger(1.000001)).toThrow();
	});

	it("is integer allows negatives", async () => {
		expect(() => isInteger(-1)).not.toThrow();
	});

	it("is integer allows integers", async () => {
		expect(() => isInteger(10)).not.toThrow();
	});

	it("is in detects null", async () => {
		expect(() => isIn(null, ["A", "B"])).toThrow();
	});

	it("is in detects undefined", async () => {
		expect(() => isIn(undefined, ["A", "B"])).toThrow();
	});

	it("is in allows existing element", async () => {
		expect(() => isIn("B", ["A", "B"])).not.toThrow();
	});

	it("is in detects non-existing element", async () => {
		expect(() => isIn("C", ["A", "B"])).toThrow();
	});

	it("is literal detects null", async () => {
		expect(() => isLiteral(null, ["A", "B"] as const)).toThrow();
	});

	it("is literal detects undefined", async () => {
		expect(() => isLiteral(undefined, ["A", "B"] as const)).toThrow();
	});

	it("is literal allows existing element", async () => {
		expect(() => isLiteral("B", ["A", "B"] as const)).not.toThrow();
	});

	it("is literal detects non-existing element", async () => {
		expect(() => isLiteral("C" as "B", ["A", "B"] as const)).toThrow();
	});

	it("not empty detects empty strings", async () => {
		expect(() => isNotEmpty("")).toThrow();
	});

	it("not empty detects null", async () => {
		expect(() => isNotEmpty(null)).toThrow();
	});

	it("not empty detects undefined", async () => {
		expect(() => isNotEmpty(undefined)).toThrow();
	});

	it("not empty allows non-empty strings", async () => {
		expect(() => isNotEmpty(".")).not.toThrow();
	});

	it("true checks for undefined", async () => {
		expect(() => isTrue(undefined)).toThrow();
	});

	it("is equal detects difference", async () => {
		expect(() => isEqual("1", "2")).toThrow();
	});

	it("is equal allows equal", async () => {
		expect(() => isEqual("1", "1")).not.toThrow();
	});

	it("true detects false", async () => {
		expect(() => isTrue(false)).toThrow();
	});

	it("true allows true", async () => {
		expect(() => isTrue(true)).not.toThrow();
	});

	it("is valid detects validation error", async () => {
		expect(() => isValid("1", (v) => v === "2")).toThrow();
	});

	it("is valid allows validation success", async () => {
		expect(() => isValid("1", (v) => v === "1")).not.toThrow();
	});

	it("not throwing allows validation success", async () => {
		expect(() => notThrowing(() => "1")).not.toThrow();
		expect(notThrowing(() => "1")).toEqual("1");
	});

	it("not throwing detects inner exception", async () => {
		expect(() =>
			notThrowing(() => {
				throw new Error("Test");
			}),
		).toThrow();
	});

	it("between detects undefined", async () => {
		expect(() => isBetween(undefined, 0, 1)).toThrow();
	});

	it("between is inclusive with lower bound", async () => {
		expect(() => isBetween(0, 0, 1)).not.toThrow();
	});

	it("between is inclusive with upper bound", async () => {
		expect(() => isBetween(1, 0, 1)).not.toThrow();
	});

	it("between allows negatives", async () => {
		expect(() => isBetween(-10, -11, -9)).not.toThrow();
	});

	it("instanceof detects undefined", async () => {
		expect(() => isInstanceOf(undefined, Error)).toThrow();
	});

	it("instanceof detects differing types", async () => {
		expect(() => isInstanceOf(new Date(), Error)).toThrow();
	});

	it("instanceof allows same types", async () => {
		expect(() => isInstanceOf(new Date(), Date)).not.toThrow();
	});

	it("instanceof throws good errors", async () => {
		expect(() => isInstanceOf(null, String)).toThrow("Value was not of type [String] was [null].");
		expect(() => isInstanceOf(undefined, String)).toThrow("Value was not of type [String] was [undefined].");
		expect(() => isInstanceOf(1, String)).toThrow("Value was not of type [String] was [number].");
		expect(() => isInstanceOf("hello", String)).toThrow("Value was not of type [String] was [string].");
		expect(() => isInstanceOf(new Date(), String)).toThrow("Value was not of type [String] was [Date].");
		expect(() => isInstanceOf({}, String)).toThrow("Value was not of type [String] was [Object].");
		expect(() => isInstanceOf([], String)).toThrow("Value was not of type [String] was [Array].");
	});

	it("instanceof allows sub-types", async () => {
		class MyDate extends Date {
			constructor() {
				super();
			}
		}
		expect(() => isInstanceOf(new MyDate(), Date)).not.toThrow();
	});

	it("instanceof detects super-types", async () => {
		class MyDate extends Date {
			constructor() {
				super();
			}
		}
		expect(() => isInstanceOf(new Date(), MyDate)).toThrow();
	});

	it("instanceof allows abstract super-types", async () => {
		abstract class BaseTest {}
		class Test extends BaseTest {
			constructor() {
				super();
			}
		}
		expect(() => isInstanceOf(new Test(), BaseTest)).not.toThrow();
	});

	it("is valid date detects null", async () => {
		expect(() => isValidDate(null as unknown as Date)).toThrow();
	});

	it("is valid date detects undefined", async () => {
		expect(() => isValidDate(undefined as unknown as Date)).toThrow();
	});

	it("is valid date detects invalid date", async () => {
		expect(() => isValidDate(new Date(undefined as unknown as number))).toThrow();
	});

	it("is valid date detects other types", async () => {
		expect(() => isValidDate(new Error() as unknown as Date)).toThrow();
	});

	it("is valid date allows dates", async () => {
		expect(() => isValidDate(new Date())).not.toThrow();
	});

	it("in union detects undefined", async () => {
		expect(() => isInUnion(undefined, [Error])).toThrow();
	});

	it("in union detects differing types", async () => {
		expect(() => isInUnion(new Date(), [Error])).toThrow();
	});

	it("in union allows same types", async () => {
		expect(() => isInUnion(new Date(), [Date])).not.toThrow();
	});

	it("in union allows subset matching types", async () => {
		expect(() => isInUnion(new Date(), [Error, Date])).not.toThrow();
	});

	it("in union allows subtype matches", async () => {
		class MyDate extends Date {
			constructor() {
				super();
			}
		}
		expect(() => isInUnion(new MyDate(), [Date])).not.toThrow();
	});

	it("in union throws good errors", async () => {
		expect(() => isInUnion(null, [Date, String])).toThrow("Value was not in union [Date, String] was [null].");
		expect(() => isInUnion(undefined, [Date, String])).toThrow(
			"Value was not in union [Date, String] was [undefined].",
		);
		expect(() => isInUnion(1, [Date, String])).toThrow("Value was not in union [Date, String] was [number].");
		expect(() => isInUnion("hello", [Date, String])).toThrow("Value was not in union [Date, String] was [string].");
		expect(() => isInUnion(new Date(), [Number, String])).toThrow(
			"Value was not in union [Number, String] was [Date].",
		);
		expect(() => isInUnion({}, [Date, String])).toThrow("Value was not in union [Date, String] was [Object].");
		expect(() => isInUnion([], [Date, String])).toThrow("Value was not in union [Date, String] was [Array].");
	});

	it("custom exceptions can be thrown", async () => {
		class CustomError extends Error {
			constructor() {
				super("My error.");
			}
		}
		expect(() => isTrue(false, new CustomError())).toThrow(new CustomError());
	});

});
