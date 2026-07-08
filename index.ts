import { visit } from "unist-util-visit"
import type { Root, Element, Parent } from "hast"

export default {
  name: "HTML Headings",

  markdownPlugins() {
    return [
      () => {
        return (tree: Root) => {
          visit(
            tree,
            "element",
            (node: Element, index: number | undefined, parent: Parent | undefined) => {
              if (!parent || index === undefined) return

              if (
                node.tagName.match(/^h[1-6]$/i)
              ) {
                parent.children[index] = {
                  type: "element",
                  tagName: node.tagName,
                  properties: node.properties,
                  children: node.children,
                }
              }
            },
          )
        }
      },
    ]
  },
}