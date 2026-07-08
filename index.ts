console.log("HTML HEADINGS PLUGIN LOADED")

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
                  /^<h([1-6])(?:\s[^>]*)?>(.*?)<\/h\1>$/is,
                )

                if (!match) return

                const depth = Number(match[1]) as 1 | 2 | 3 | 4 | 5 | 6

                parent.children[index] = {
                  type: "heading",
                  depth,
                  children: [
                    {
                      type: "text",
                      value: match[2].replace(/<[^>]*>/g, "").trim(),
                    },
                  ],
                }

                console.log(`CONVERTED HTML h${depth}: ${match[2]}`)
              },
            )
          }
        },
      ]
    },
  }
}

export default HTMLHeadings