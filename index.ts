import { visit } from "unist-util-visit"
import type { Root, HTML, Parent } from "mdast"

export const HTMLHeadings = () => {
  return {
    name: "HTML Headings",

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

                const depth = Number(match[1]) as 1 | 2 | 3 | 4 | 5 | 6

                const attributes = match[2] ?? ""
                const text = match[3].replace(/<[^>]*>/g, "").trim()

                const customId = attributes.match(/id="([^"]+)"/)?.[1]

                // Quartz's normal slug format
                const slug = text
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .trim()
                  .replace(/\s+/g, "-")

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

                if (customId && customId !== slug) {
                  parent.children.splice(
                    index,
                    1,
                    {
                      type: "html",
                      value: `<a id="${slug}"></a>`,
                    },
                    heading,
                  )
                } else {
                  parent.children[index] = heading
                }
              },
            )
          }
        },
      ]
    },
  }
}

export default HTMLHeadings