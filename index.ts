console.log("HTML HEADINGS PLUGIN LOADED")

import { visit } from "unist-util-visit"
import type { Root, HTML, Parent } from "mdast"

export default {
  name: "HTML Headings",

  markdownPlugins() {
    return [
      () => {
        return (tree: Root) => {
          console.log("MARKDOWN TREE RUNNING")

          visit(
            tree,
            "html",
            (
              node: HTML,
              index: number | undefined,
              parent: Parent | undefined,
            ) => {
              console.log("HTML NODE FOUND:", node.value)

              if (!parent || index === undefined) return

              const match = node.value.match(
                /^<h([1-6])(?:\s[^>]*)?>(.*?)<\/h\1>$/is,
              )

              if (!match) {
                console.log("NOT A HEADING")
                return
              }

              const depthNumber = Number(match[1])

              if (depthNumber < 1 || depthNumber > 6) {
                console.log("INVALID DEPTH:", depthNumber)
                return
              }

              const depth = depthNumber as 1 | 2 | 3 | 4 | 5 | 6

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