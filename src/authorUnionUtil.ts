import {
  HydratedGitBlobObject,
  HydratedGitTreeObject,
} from "~/analyzer/model"

export const makeDupeMap = (authors: string[][]) => {
  const dupeMap = new Map<string, string>()
  for (const aliases of authors) {
    for (const alias of aliases) {
      dupeMap.set(alias, aliases[0])
    }
  }
  return dupeMap
}

export function unionAuthors(
  blob: HydratedGitBlobObject,
  authorAliasMap: Map<string, string>
) {
  const authorCopy = { ...blob.authors }
  return Object.entries(authorCopy).reduce<HydratedGitBlobObject["authors"]>(
    (newAuthorObject, [authorOrAlias, contributionCount]) => {
      // Lookup the author in the dupe list
      const author = authorAliasMap.get(authorOrAlias)

      // If the author is in the dupe list
      if (author) {
        const credits = (newAuthorObject[author] ?? 0) + contributionCount
        return {
          ...newAuthorObject,
          [author]: credits,
        }
      }

      return { ...newAuthorObject, [authorOrAlias]: contributionCount }
    },
    {}
  )
}

export function addAuthorUnion(
  tree: HydratedGitTreeObject,
  authorUnions: Map<string, string>
) {
  for (const child of tree.children) {
    if (child.type === "blob") {
      child.unionedAuthors = unionAuthors(child, authorUnions)
    } else {
      addAuthorUnion(child, authorUnions)
    }
  }
}

export function calculateAuthorshipForSubTree(tree: HydratedGitTreeObject) {
  const aggregatedAuthors: Record<string, number> = {}
  subTree(tree)
  function subTree(tree: HydratedGitTreeObject) {
      for (const child of tree.children) {
          if (child.type === "blob") {
              if (!child.unionedAuthors) throw Error("No unioned authors")
              for (const [author, contrib] of Object.entries(child.unionedAuthors)) {
                  aggregatedAuthors[author] = (aggregatedAuthors[author] ?? 0) + contrib
              }
          } else if (child.type === "tree") {
              subTree(child)
          }
      }
  }
  return aggregatedAuthors
}
