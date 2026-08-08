/** Strips anything that isn't a letter (any script), space, hyphen, or apostrophe — for name-like fields. */
export function filterLettersOnly(value: string) {
  return value.replace(/[^\p{L}\s'-]/gu, "");
}
