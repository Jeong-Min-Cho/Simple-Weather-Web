import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn (className utility)", () => {
  it("문자열 클래스를 병합한다", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("조건부 클래스를 처리한다", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    expect(cn("foo", true && "bar", "baz")).toBe("foo bar baz");
  });

  it("객체 형태의 클래스를 처리한다", () => {
    expect(cn({ foo: true, bar: false })).toBe("foo");
    expect(cn({ foo: true, bar: true })).toBe("foo bar");
  });

  it("배열 형태의 클래스를 처리한다", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("Tailwind 클래스를 병합한다", () => {
    // tailwind-merge가 중복된 유틸리티를 처리
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("undefined와 null을 무시한다", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("빈 문자열을 무시한다", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });
});
