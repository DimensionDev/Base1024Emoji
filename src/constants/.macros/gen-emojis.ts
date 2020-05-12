import * as fs from "fs";
import * as path from "path";
import emojis from "./twemojis.json";

/**
 * Constants
 */
const EMOJIS = emojis.source;

/**
 * Sorting emojis
 * --------------
 * + no nation && flags
 * + independent emojis - without `'-'`
 * + code point doesn't change after encoding to emoji string
 * + the length of emoji string is `2`
 */
const rSort = EMOJIS
    .filter((e: string) => e.length < 6)
    .map((point: string): number => Number.parseInt(point, 16))
    .filter((e: number): boolean => {
        const s = String.fromCodePoint(e);
        return s.codePointAt(0) === e && s.length === 2
    })
    .sort((a: number, b: number) => a - b)
    .slice(0, 1024)
    // delete the following line if you want to generate the code point array
    .map((point: number) => String.fromCodePoint(point));

/**
 * Get the code point ranges of emojis
 * ------------------------------------
 * ```
 * function _emojiRanges(r: number[]) {
 *     const ranges: Record<number, [number, number]> = {};
 *     let ptr: number = 0;
 *     for (const i in r) {
 *         if (r[i] + 1 == r[+i + 1]) {
 *             ranges[ptr][1] = r[+i + 1]
 *             continue;
 *         }
 *
 *         ptr = r[i];
 *         ranges[ptr] = [ptr, ptr];
 *     }
 *     return ranges
 * }
 * ```
*/////////// generating emojis
; (() => {
    const json = JSON.stringify({ points: rSort }) + "\n";
    fs.writeFileSync(path.join(__dirname, "../emojis.json"), json);
})();
