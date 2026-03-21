import { describe, it, expect } from "vitest"
import {
  computeLineOffsets,
  renderWithLocations,
} from "../src/utils/markdoc-highlight"

describe("computeLineOffsets", () => {
  it("single line", () => {
    expect(computeLineOffsets("hello")).toEqual([0])
  })

  it("multiple lines", () => {
    expect(computeLineOffsets("ab\ncd\nef")).toEqual([0, 3, 6])
  })

  it("empty string", () => {
    expect(computeLineOffsets("")).toEqual([0])
  })
})

describe("renderWithLocations", () => {
  it("heading has data-offset attributes", () => {
    const html = renderWithLocations("# Hello")
    expect(html).toContain("<h1")
    expect(html).toContain("data-offset-start")
    expect(html).toContain("data-offset-end")
    expect(html).toContain("Hello")
  })

  it("heading offset covers entire line", () => {
    const html = renderWithLocations("# Hello")
    expect(html).toMatch(/h1[^>]*data-offset-start="0"/)
    expect(html).toMatch(/h1[^>]*data-offset-end="7"/)
  })

  it("paragraph has data-offset attributes", () => {
    const html = renderWithLocations("Hello world")
    expect(html).toContain("<p")
    expect(html).toContain("data-offset-start")
  })

  it("strong has precise character offsets", () => {
    const html = renderWithLocations("**bold** text")
    expect(html).toMatch(/strong[^>]*data-offset-start="0"/)
    expect(html).toMatch(/strong[^>]*data-offset-end="8"/)
  })

  it("em has precise character offsets", () => {
    const html = renderWithLocations("text *italic*")
    expect(html).toMatch(/em[^>]*data-offset-start="5"/)
    expect(html).toMatch(/em[^>]*data-offset-end="13"/)
  })

  it("strong and em on same line have distinct offsets", () => {
    const html = renderWithLocations("**bold** and *italic*")
    expect(html).toMatch(/strong[^>]*data-offset-start="0"/)
    expect(html).toMatch(/strong[^>]*data-offset-end="8"/)
    expect(html).toMatch(/em[^>]*data-offset-start="13"/)
    expect(html).toMatch(/em[^>]*data-offset-end="21"/)
  })

  it("inline code has precise offsets", () => {
    const html = renderWithLocations("some `code` here")
    expect(html).toMatch(/code[^>]*data-offset-start="5"/)
    expect(html).toMatch(/code[^>]*data-offset-end="11"/)
  })

  it("link has precise offsets and href", () => {
    const html = renderWithLocations("[text](http://example.com)")
    expect(html).toContain('href="http://example.com"')
    expect(html).toMatch(/a[^>]*data-offset-start="0"/)
    expect(html).toMatch(/a[^>]*data-offset-end="26"/)
  })

  it("list items have data-offset attributes", () => {
    const html = renderWithLocations("- item1\n- item2")
    expect(html).toContain("<ul")
    expect(html).toContain("<li")
    expect(html).toMatch(/li[^>]*data-offset-start/)
  })

  it("code block has data-offset attributes", () => {
    const html = renderWithLocations("```\ncode\n```")
    expect(html).toContain("<pre")
    expect(html).toMatch(/pre[^>]*data-offset-start/)
  })

  it("multi-line offsets are correct", () => {
    const html = renderWithLocations("# Heading\n\nParagraph")
    expect(html).toMatch(/h1[^>]*data-offset-start="0"/)
    expect(html).toMatch(/h1[^>]*data-offset-end="10"/)
    expect(html).toMatch(/p[^>]*data-offset-start="11"/)
    expect(html).toMatch(/p[^>]*data-offset-end="20"/)
  })

  it("end-of-line offset is within element range", () => {
    const html = renderWithLocations("# Hello")
    expect(html).toMatch(/h1[^>]*data-offset-start="0"/)
    expect(html).toMatch(/h1[^>]*data-offset-end="7"/)
  })
})
