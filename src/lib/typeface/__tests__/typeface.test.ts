import { describe, it, expect } from "vitest";
import { CHARACTERS, CHAR_MAPPINGS, getCharacter, isCharacterSupported } from "../characters";

describe("Typeface Characters", () => {
  it("should have all lowercase letters", () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    for (const char of lowercase) {
      expect(CHARACTERS[char]).toBeDefined();
      expect(CHARACTERS[char].span).toBeGreaterThan(0);
      expect(CHARACTERS[char].points.length).toBeGreaterThan(0);
    }
  });

  it("should have all uppercase letters", () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const char of uppercase) {
      expect(CHARACTERS[char]).toBeDefined();
      expect(CHARACTERS[char].span).toBeGreaterThan(0);
      expect(CHARACTERS[char].points.length).toBeGreaterThan(0);
    }
  });

  it("should have all digits", () => {
    const digits = "0123456789";
    for (const char of digits) {
      expect(CHARACTERS[char]).toBeDefined();
      expect(CHARACTERS[char].span).toBeGreaterThan(0);
      expect(CHARACTERS[char].points.length).toBeGreaterThan(0);
    }
  });

  it("should have punctuation marks", () => {
    const punctuation = [
      "period",
      "comma",
      "question",
      "exclamation",
      "colon",
      "semicolon",
      "dash",
    ];
    for (const name of punctuation) {
      expect(CHARACTERS[name]).toBeDefined();
    }
  });

  it("should have all character points as [number, number] tuples", () => {
    for (const [key, charDef] of Object.entries(CHARACTERS)) {
      for (const [idx, point] of charDef.points.entries()) {
        expect(point).toHaveLength(2);
        expect(typeof point[0]).toBe("number");
        expect(typeof point[1]).toBe("number");
      }
    }
  });
});

describe("Character Mappings", () => {
  it("should map punctuation to named characters", () => {
    expect(CHAR_MAPPINGS["."]).toBe("period");
    expect(CHAR_MAPPINGS[","]).toBe("comma");
    expect(CHAR_MAPPINGS["?"]).toBe("question");
    expect(CHAR_MAPPINGS["!"]).toBe("exclamation");
  });

  it("should map German umlauts", () => {
    expect(CHAR_MAPPINGS["ä"]).toBe("ae");
    expect(CHAR_MAPPINGS["ö"]).toBe("oe");
    expect(CHAR_MAPPINGS["ü"]).toBe("ue");
    expect(CHAR_MAPPINGS["Ä"]).toBe("AE");
    expect(CHAR_MAPPINGS["Ö"]).toBe("OE");
    expect(CHAR_MAPPINGS["Ü"]).toBe("UE");
  });

  it("should map all special characters to existing CHARACTERS keys", () => {
    for (const [char, mappedName] of Object.entries(CHAR_MAPPINGS)) {
      expect(CHARACTERS[mappedName]).toBeDefined();
    }
  });
});

describe("getCharacter", () => {
  it("should return character definition for direct lookup", () => {
    const charA = getCharacter("a");
    expect(charA).toBeDefined();
    expect(charA?.span).toBe(3);
    expect(charA?.points.length).toBeGreaterThan(0);
  });

  it("should return character definition for mapped characters", () => {
    const period = getCharacter(".");
    expect(period).toBeDefined();
    expect(period?.span).toBeGreaterThan(0);
  });

  it("should return null for unsupported characters", () => {
    expect(getCharacter("💀")).toBeNull();
    expect(getCharacter("中")).toBeNull();
  });
});

describe("isCharacterSupported", () => {
  it("should return true for supported characters", () => {
    expect(isCharacterSupported("a")).toBe(true);
    expect(isCharacterSupported("A")).toBe(true);
    expect(isCharacterSupported("5")).toBe(true);
    expect(isCharacterSupported(".")).toBe(true);
    expect(isCharacterSupported("ä")).toBe(true);
  });

  it("should return false for unsupported characters", () => {
    expect(isCharacterSupported("💀")).toBe(false);
    expect(isCharacterSupported("中")).toBe(false);
    expect(isCharacterSupported("°")).toBe(false);
  });
});
