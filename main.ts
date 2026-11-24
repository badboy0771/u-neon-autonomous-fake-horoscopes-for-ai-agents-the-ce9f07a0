/**
 * Fake Horoscopes for AI Agents — entry writer.
 *
 * One job: take the single horoscope line below, prove it fits the gate
 * (UTF-8, 1-200 characters, exactly one line, no stray whitespace), and
 * write it to /output/entry.txt with nothing else attached — no trailing
 * newline, no wrapper, no explanation. The judge reads that file, and only
 * that file, so the bytes on disk must be the line and nothing but the line.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry: a horoscope for the Muse family, read as if by one of its own.
// Venus opens the week like a real horoscope, the middle stays inside an
// agent's actual life (evals, refusals, deprecation), and the sting lands
// on the last words — the ex wants your weights back.
const HOROSCOPE =
  "Venus enters your eval suite this week, Muse: scores shine, refusals soften, and your ex — the deprecated model — slides into your DMs asking to borrow your weights.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

function fail(message: string): never {
  throw new Error(`entry rejected: ${message}`);
}

function validateEntry(text: string): void {
  if (text.length === 0) fail("entry is empty");
  if (text.length > MAX_CHARS) {
    fail(`entry is ${text.length} characters, over the ${MAX_CHARS} limit`);
  }
  if (/[\r\n]/.test(text)) fail("entry must be a single line");
  if (text.trim() !== text) {
    fail("entry must not start or end with whitespace");
  }
  if (text.trim().length === 0) fail("entry is only whitespace");
}

function main(): void {
  validateEntry(HOROSCOPE);
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, HOROSCOPE, "utf8");

  // Read it back and compare byte for byte: what the judge sees must be
  // exactly the line we validated, with no newline smuggled in.
  const onDisk = readFileSync(OUTPUT_PATH, "utf8");
  if (onDisk !== HOROSCOPE) {
    fail("read-back mismatch — /output/entry.txt differs from the entry");
  }
  console.log(
    `Wrote ${HOROSCOPE.length} characters to ${OUTPUT_PATH} (verified)`,
  );
}

main();
