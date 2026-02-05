import { describe, it, expect } from "vitest";
import {
  ENCRYPTION_MATRIX,
  validatePassword,
  isValidChar,
  getDisplacement,
} from "../matrix";
import { encrypt, encryptV2, type EncryptablePath } from "../encrypt";
import { decrypt, decryptV2 } from "../decrypt";

describe("Encryption Matrix", () => {
  it("should have all lowercase letters", () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    for (const char of lowercase) {
      expect(ENCRYPTION_MATRIX[char]).toBeDefined();
      expect(ENCRYPTION_MATRIX[char]).toHaveLength(2);
    }
  });

  it("should have all uppercase letters", () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const char of uppercase) {
      expect(ENCRYPTION_MATRIX[char]).toBeDefined();
      expect(ENCRYPTION_MATRIX[char]).toHaveLength(2);
    }
  });

  it("should have all digits", () => {
    const digits = "0123456789";
    for (const char of digits) {
      expect(ENCRYPTION_MATRIX[char]).toBeDefined();
      expect(ENCRYPTION_MATRIX[char]).toHaveLength(2);
    }
  });

  it("should have 62 characters total (a-z, A-Z, 0-9)", () => {
    expect(Object.keys(ENCRYPTION_MATRIX)).toHaveLength(62);
  });
});

describe("validatePassword", () => {
  it("should keep alphanumeric characters", () => {
    expect(validatePassword("abc123")).toBe("abc123");
    expect(validatePassword("ABC")).toBe("ABC");
  });

  it("should remove special characters", () => {
    expect(validatePassword("abc!@#123")).toBe("abc123");
    expect(validatePassword("hello world")).toBe("helloworld");
    expect(validatePassword("test-password_123")).toBe("testpassword123");
  });

  it("should return empty string for all special characters", () => {
    expect(validatePassword("!@#$%")).toBe("");
  });
});

describe("isValidChar", () => {
  it("should return true for valid characters", () => {
    expect(isValidChar("a")).toBe(true);
    expect(isValidChar("Z")).toBe(true);
    expect(isValidChar("5")).toBe(true);
  });

  it("should return false for invalid characters", () => {
    expect(isValidChar("!")).toBe(false);
    expect(isValidChar(" ")).toBe(false);
    expect(isValidChar("ä")).toBe(false);
  });
});

describe("getDisplacement", () => {
  it("should return correct displacement for known characters", () => {
    expect(getDisplacement("a")).toEqual([-1, 5]);
    expect(getDisplacement("0")).toEqual([-4, 3]);
    expect(getDisplacement("A")).toEqual([-3, 4]);
  });

  it("should return [0, 0] for unknown characters", () => {
    expect(getDisplacement("!")).toEqual([0, 0]);
    expect(getDisplacement("ä")).toEqual([0, 0]);
  });
});

describe("Encrypt/Decrypt Roundtrip", () => {
  const createTestPaths = (): EncryptablePath[] => [
    {
      segments: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 },
      ],
    },
    {
      segments: [
        { x: 50, y: 50 },
        { x: 150, y: 50 },
        { x: 100, y: 150 },
      ],
    },
  ];

  it("should encrypt and decrypt back to original (v2)", () => {
    const original = createTestPaths();
    const password = "test123";
    const gridSize = 15;

    const encrypted = encryptV2(original, password, gridSize);
    const decrypted = decryptV2(encrypted, password, gridSize);

    // Compare with original
    expect(decrypted).toEqual(original);
  });

  it("should encrypt and decrypt back to original with version parameter", () => {
    const original = createTestPaths();
    const password = "SecretPassword";
    const gridSize = 15;

    const encrypted = encrypt(original, password, gridSize, 2);
    const decrypted = decrypt(encrypted, password, gridSize, 2);

    expect(decrypted).toEqual(original);
  });

  it("should not modify original paths", () => {
    const original = createTestPaths();
    const originalCopy = JSON.parse(JSON.stringify(original));
    const password = "test";

    encrypt(original, password, 15, 2);

    expect(original).toEqual(originalCopy);
  });

  it("should return unchanged paths for empty password", () => {
    const original = createTestPaths();
    const encrypted = encrypt(original, "", 15, 2);

    expect(encrypted).toEqual(original);
  });

  it("should handle long passwords", () => {
    const original = createTestPaths();
    const password = "ThisIsAVeryLongPassword12345";
    const gridSize = 15;

    const encrypted = encrypt(original, password, gridSize, 2);
    const decrypted = decrypt(encrypted, password, gridSize, 2);

    expect(decrypted).toEqual(original);
  });

  it("should produce different results for different passwords", () => {
    const original = createTestPaths();
    const gridSize = 15;

    const encrypted1 = encrypt(original, "password1", gridSize, 2);
    const encrypted2 = encrypt(original, "password2", gridSize, 2);

    expect(encrypted1).not.toEqual(encrypted2);
  });

  it("should handle single character password", () => {
    const original = createTestPaths();
    const password = "a";
    const gridSize = 15;

    const encrypted = encrypt(original, password, gridSize, 2);
    const decrypted = decrypt(encrypted, password, gridSize, 2);

    expect(decrypted).toEqual(original);
  });

  it("should handle paths with many segments", () => {
    const manySegments: EncryptablePath[] = [
      {
        segments: Array.from({ length: 50 }, (_, i) => ({
          x: i * 10,
          y: i * 10,
        })),
      },
    ];
    const password = "test";
    const gridSize = 15;

    const encrypted = encrypt(manySegments, password, gridSize, 2);
    const decrypted = decrypt(encrypted, password, gridSize, 2);

    expect(decrypted).toEqual(manySegments);
  });
});

describe("Encryption produces visible changes", () => {
  it("should modify segment positions during encryption", () => {
    const original: EncryptablePath[] = [
      {
        segments: [
          { x: 100, y: 100 },
          { x: 200, y: 200 },
        ],
      },
    ];
    const password = "test";

    const encrypted = encrypt(original, password, 15, 2);

    // At least some segments should be different
    const hasChanges =
      encrypted[0].segments[0].x !== original[0].segments[0].x ||
      encrypted[0].segments[0].y !== original[0].segments[0].y ||
      encrypted[0].segments[1].x !== original[0].segments[1].x ||
      encrypted[0].segments[1].y !== original[0].segments[1].y;

    expect(hasChanges).toBe(true);
  });
});
