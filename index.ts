import { visit } from "unist-util-visit"
import type { Root } from "hast"

export const HTMLHeadings = () => {
  return {
    name: "HTML Headings",

    htmlPlugins() {
      return [
        () => {
          return (tree: Root) => {
            visit(tree, "element", (node: any) => {
              if (!/^h[1-6]$/.test(node.tagName)) return

              const text = getText(node)

              const slug = text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-")

              const customId =
                typeof node.properties?.id === "string"
                  ? node.properties.id
                  : undefined

              // Keep user supplied IDs
              if (customId) {
                node.properties.id = customId
              } else {
                node.properties.id = slug
              }
            })
          }
        },
      ]
    },
  }
}

function getText(node: any): string {
  if (node.type === "text") {
    return node.value
  }

  if (!node.children) {
    return ""
  }

  return node.children
    .map(getText)
    .join("")
    .trim()
}

export default HTMLHeadings