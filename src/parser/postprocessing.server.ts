import { Ignore } from "ignore"
import { HydratedGitTreeObject, ParserData } from "./model"

export function initMetrics(data: ParserData) {
    data.commit.minNoCommits = Number.MAX_VALUE
    data.commit.maxNoCommits = Number.MIN_VALUE
    data.commit.oldestLatestChangeEpoch = Number.MAX_VALUE
    data.commit.newestLatestChangeEpoch = Number.MIN_VALUE
}

export function applyMetrics(
    data: ParserData,
    currentTree: HydratedGitTreeObject
): HydratedGitTreeObject {
    return {
        ...currentTree,
        children: currentTree.children.map((current) => {
        if (current.type === "tree") return applyMetrics(data, current)
        if (!current.lastChangeEpoch) return current

        const numCommits = current.noCommits

        if (numCommits < data.commit.minNoCommits)
            data.commit.minNoCommits = numCommits
        if (numCommits > data.commit.maxNoCommits)
            data.commit.maxNoCommits = numCommits

        if (current.lastChangeEpoch > data.commit.newestLatestChangeEpoch) {
            data.commit.newestLatestChangeEpoch = current.lastChangeEpoch
        }

        if (current.lastChangeEpoch < data.commit.oldestLatestChangeEpoch) {
            data.commit.oldestLatestChangeEpoch = current.lastChangeEpoch
        }
        return current
        }),
    }
}

export function applyIgnore(
    tree: HydratedGitTreeObject,
    truckIgnore: Ignore
): HydratedGitTreeObject {
    return {
        ...tree,
        children: tree.children
        .filter((child) => {
            return !truckIgnore.ignores(child.path)
        })
        .map((child) => {
            if (child.type === "tree") return applyIgnore(child, truckIgnore)
            return child
        }),
    }
}