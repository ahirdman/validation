
type BooleanValue = boolean | null | undefined;
type NumericValue = number | null | undefined;
type StringValue = string | null | undefined;
type PrimitiveValue = boolean | number | string | null | undefined;

interface Abstract<T> extends Function {
	prototype: T;
}

interface Type<T> extends Function {
	new (...args: any[]): T;
}

function isDefined(value?: any): boolean {
	return value !== undefined && value !== null;
}

function assertOrThrow(condition: boolean, message: string | Error | undefined): void {
	if (!condition) {
		if (message instanceof Error) {
			throw message;
		} else {
			throw new Error(message || "Unknown error.");
		}
	}
}

export function isEqual<T>(value: T, expected: T, message?: string | Error): T {
	assertOrThrow(value === expected, message || "Value was not equal to expected.");

	return value;
}

export function isTrue(condition: boolean | undefined, message?: string | Error): void {
	assertOrThrow(isDefined(condition) && condition!, message || "Condition was not true.");
}

export function isValid<T>(value: T, validator: (value: T) => boolean, message?: string | Error): T {
	assertOrThrow(validator(value), message || "Validator did not return true.");

	return value;
}

export function notThrowing<T>(func: () => T, message?: string | Error): T {
	try {
		return func();
	} catch (e) {
		if (message instanceof Error) {
			throw message;
		} else {
			throw new Error(message);
		}
	}
}

export function isNotNull<T>(value: T | null | undefined, message?: string | Error): T {
	assertOrThrow(isDefined(value), message || "Value was null.");

	return value!;
}

export function isNotEmpty(value: StringValue, message?: string | Error): string {
	const condition = isDefined(value) && value!.length > 0;

	assertOrThrow(condition, message || "String was null or empty.");

	return value!;
}

export function noNullElements<T>(values: T[] | undefined, message?: string | Error): T[] {
	const condition = isDefined(values) && Array.isArray(values) && !values.some((value) => !isDefined(value));

	assertOrThrow(condition, message || "Value was not array or contained null items.");

	return values!;
}

export function matches(value: StringValue, pattern: RegExp, message?: string | Error): string {
	const condition = isDefined(value) && pattern.test(value!);

	assertOrThrow(condition, message || `Value [${String(value!)}] did not match pattern.`);

	return value!;
}

export function isBetween(value: NumericValue, min: number, max: number, message?: string | Error): number {
	const condition = isDefined(value) && value! >= min && value! <= max;

	assertOrThrow(condition, message || `Value [${value!}] was not within limits [${min} - ${max}].`);

	return value!;
}

export function isIn(value: PrimitiveValue, list: readonly PrimitiveValue[], message?: string | Error): PrimitiveValue {
	const condition = isDefined(value) && list.includes(value);

	assertOrThrow(condition, message || `Value [${String(value!)}] was not in list [${list.join(", ")}].`);

	return value;
}

export function isLiteral<T extends string extends T ? never : string, I extends T>(
	value: I | null | undefined,
	list: readonly T[],
	message?: string | Error,
): T {
	const condition = isDefined(value) && list.includes(value!);

	assertOrThrow(condition, message || `Value [${String(value!)}] was not in list [${list.join(", ")}].`);

	return value!;
}

export function isBoolean(value: BooleanValue, message?: string | Error): boolean {
	const condition = typeof value === "boolean";

	assertOrThrow(condition, message || `Boolean ${String(value!)} was not a boolean.`);

	return value as boolean;
}

export function isNumber(value: PrimitiveValue, message?: string | Error): number {
	const error = message || `Value [${String(value!)}] was not a number.`;
	const conditionA = isDefined(value);

	assertOrThrow(conditionA, error);

	const floatNumber = parseFloat(String(value!));
	const conditionB = !Number.isNaN(floatNumber);

	assertOrThrow(conditionB, error);

	return floatNumber;
}

export function isInteger(value: NumericValue, message?: string | Error): number {
	const condition = isDefined(value) && Number.isInteger(value!);

	assertOrThrow(condition, message || `Value [${String(value!)}] was not an integer.`);

	return value as number;
}

export function isInstanceOf<T>(value: any | undefined, type: Abstract<T>, message?: string | Error): T {
	const condition = isDefined(value) && value instanceof type;
	assertOrThrow(
		condition,
		message ||
			`Value was not of type [${type.name}] was [${
				value === null
					? "null"
					: typeof value === "object"
					? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					  String(value?.constructor?.name)
					: typeof value
			}].`,
	);

	return value as T;
}

export function isValidDate(value: Date, message?: string | Error): Date {
	const error = message || `Value was not a valid date.`;
	const date = isInstanceOf(value, Date, error);
	const condition = !isNaN(date.getTime());
	assertOrThrow(condition, error);

	return date;
}

export function isInUnion<T extends readonly Type<any>[]>(
	value: any | undefined,
	union: T,
	message?: string | Error,
): InstanceType<T[number]> {
	const condition = isDefined(value) && union.some((type) => value instanceof type);

	assertOrThrow(
		condition,
		message ||
			`Value was not in union [${union.map((type) => type.name).join(", ")}] was [${
				value === null
					? "null"
					: typeof value === "object"
					? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					  String(value?.constructor?.name)
					: typeof value
			}].`,
	);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return value as InstanceType<T[number]>;
}
