import { visit } from "unist-util-visit"
import type { Root, HTML, Parent } from "mdast"

export const HTMLHeadings = () => {
  return {
    name: "HTML Headings",
    priority: "45", // Ranks after ToC pluging (50). This is needed for it to work properly with the ToC plugin.

    markdownPlugins() {
      return [
        () => {
          return (tree: Root) => {
            visit(
              tree,
              "html",
              (
                node: HTML,
                index: number | undefined,
                parent: Parent | undefined,
              ) => {
                if (!parent || index === undefined) return

                const match = node.value.match(
                  /<h([1-6])(?:\s([^>]*))?>(.*?)<\/h\1>/is,
                )

                if (!match) return

                const depth = Number(match[1]) as
                  | 1
                  | 2
                  | 3
                  | 4
                  | 5
                  | 6

                const attributes = match[2] ?? ""

                const text = match[3]
                  .replace(/<[^>]*>/g, "")
                  .trim()

                const customId = attributes.match(
                  /id=["']([^"']+)["']/,
                )?.[1]

                const heading = {
                  type: "heading" as const,
                  depth,
                  data: {
                    hProperties: {
                      id: customId,
                    },
                  },
                  children: [
                    {
                      type: "text" as const,
                      value: text,
                    },
                  ],
                }

                const before = node.value.slice(
                  0,
                  match.index,
                )

                const after = node.value.slice(
                  (match.index ?? 0) + match[0].length,
                )

                const replacement = []

                if (before.trim()) {
                  replacement.push({
                    type: "html" as const,
                    value: before,
                  })
                }

                replacement.push(heading)

                if (after.trim()) {
                  replacement.push({
                    type: "html" as const,
                    value: after,
                  })
                }

                parent.children.splice(
                  index,
                  1,
                  ...replacement,
                )
              },
            )
          }
        },
      ]
    },
  }
}

export default HTMLHeadings