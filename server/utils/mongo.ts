export function isDuplicateKeyError(err: unknown): boolean {
  return !!err && typeof err === "object" && "code" in err && err.code === 11000;
}
