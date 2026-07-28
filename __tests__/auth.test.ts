import { hashPassword, comparePassword } from "@/lib/passwords";
import { signAccessToken, verifyAccessToken } from "@/lib/jwt";
import { Role } from "@prisma/client";

describe("Security & Authentication Engine Tests", () => {
  test("hashPassword hashes plain text password", async () => {
    const raw = "AdminPassword123!";
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    expect(hash.length).toBeGreaterThan(20);
  });

  test("comparePassword returns true for matching password", async () => {
    const raw = "AdminPassword123!";
    const hash = await hashPassword(raw);
    const isValid = await comparePassword(raw, hash);
    expect(isValid).toBe(true);
  });

  test("comparePassword returns false for wrong password", async () => {
    const raw = "AdminPassword123!";
    const hash = await hashPassword(raw);
    const isValid = await comparePassword("WrongPass!", hash);
    expect(isValid).toBe(false);
  });

  test("signAccessToken and verifyAccessToken work correctly", () => {
    const payload = {
      userId: "user-uuid-123",
      email: "admin@orchard.com",
      role: Role.ADMIN,
      fullName: "Orchard Admin",
    };

    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);

    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe("admin@orchard.com");
    expect(decoded?.role).toBe(Role.ADMIN);
  });
});
