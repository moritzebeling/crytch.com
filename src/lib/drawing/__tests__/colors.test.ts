import { describe, it, expect } from "vitest";
import { rgbToHex, repairHex } from "../colors";

describe("rgbToHex", () => {
  it("converts standard rgb values", () => {
    expect(rgbToHex("rgb(0, 0, 0)")).toBe("#000000");
    expect(rgbToHex("rgb(255, 255, 255)")).toBe("#ffffff");
    expect(rgbToHex("rgb(255, 0, 0)")).toBe("#ff0000");
    expect(rgbToHex("rgb(0, 0, 255)")).toBe("#0000ff");
  });

  it("converts real-world values from the database", () => {
    expect(rgbToHex("rgb(253, 116, 133)")).toBe("#fd7485");
    expect(rgbToHex("rgb(113, 151, 53)")).toBe("#719735");
    expect(rgbToHex("rgb(44, 52, 62)")).toBe("#2c343e");
  });

  it("handles whitespace variations", () => {
    expect(rgbToHex("rgb(255,0,0)")).toBe("#ff0000");
    expect(rgbToHex("rgb( 255 , 0 , 0 )")).toBe("#ff0000");
  });

  it("is case-insensitive", () => {
    expect(rgbToHex("RGB(255, 0, 0)")).toBe("#ff0000");
  });

  it("returns null for invalid input", () => {
    expect(rgbToHex("not a color")).toBeNull();
    expect(rgbToHex("#ff0000")).toBeNull();
    expect(rgbToHex("rgb(256, 0, 0)")).toBeNull();
    expect(rgbToHex("rgb(0, 0)")).toBeNull();
    expect(rgbToHex("")).toBeNull();
  });
});

describe("repairHex", () => {
  it("repairs 5-digit hex codes by padding with trailing zeros", () => {
    expect(repairHex("#92b04")).toBe("#92b040");
    expect(repairHex("#f1707")).toBe("#f17070");
    expect(repairHex("##92f14")).toBe("#92f140");
    expect(repairHex("##96894")).toBe("#968940");
  });

  it("repairs hex missing the # prefix", () => {
    expect(repairHex("ffffff")).toBe("#ffffff");
    expect(repairHex("000000")).toBe("#000000");
  });

  it("expands 3-digit shorthand by doubling each digit", () => {
    expect(repairHex("#abc")).toBe("#aabbcc");
    expect(repairHex("fff")).toBe("#ffffff");
    expect(repairHex("000")).toBe("#000000");
    expect(repairHex("f00")).toBe("#ff0000");
  });

  it("handles already valid 6-digit hex", () => {
    expect(repairHex("#ff0000")).toBe("#ff0000");
    expect(repairHex("#ffffff")).toBe("#ffffff");
  });

  it("truncates values longer than 6 digits", () => {
    expect(repairHex("#ff000000")).toBe("#ff0000");
    expect(repairHex("##aabbccdd")).toBe("#aabbcc");
  });

  it("strips non-hex characters", () => {
    expect(repairHex("#gg0000")).toBe("#000000");
    expect(repairHex("xyz")).toBeNull();
  });

  it("returns null when no hex digits remain", () => {
    expect(repairHex("")).toBeNull();
    expect(repairHex("###")).toBeNull();
    expect(repairHex("xyz!@#")).toBeNull();
  });
});
