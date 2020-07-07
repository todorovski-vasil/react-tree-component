import { InputNode, Node } from '../../types/tree';
import { getUniqueId } from '../../util/util';

export const inputNodeToNodeRecursive = (inputNode: InputNode): Node => ({
    id: getUniqueId(),
    label: inputNode.label,
    children: inputNode.children
        ? inputNode.children.map((child) => inputNodeToNodeRecursive(child))
        : [],
    expanded: false,
});

export function checkIfNodeIsExpandedRecursive(node: Node): boolean {
    if (node.children.length) {
        if (!node.expanded) {
            return false;
        } else {
            return node.children.reduce(
                (acc: boolean, node: Node): boolean =>
                    acc && checkIfNodeIsExpandedRecursive(node),
                true
            );
        }
    } else {
        return true;
    }
}

export function changeExpandedFlagRecursive(
    node: Node,
    id: string,
    expanded: boolean
): Node {
    if (node.children.length) {
        if (node.id === id) {
            node.expanded = expanded;
            return node;
        } else {
            return {
                ...node,
                children: node.children.map((child) =>
                    changeExpandedFlagRecursive(child, id, expanded)
                ),
            };
        }
    } else {
        if (node.id === id) {
            node.expanded = expanded;
        }

        return node;
    }
}

export function expandAllNodesRecursive(node: Node): Node {
    if (node.children.length) {
        return {
            ...node,
            expanded: true,
            children: node.children.map((node) =>
                expandAllNodesRecursive(node)
            ),
        };
    } else {
        return node;
    }
}

export function colapseAllNodesRecursive(node: Node): Node {
    if (node.children.length) {
        return {
            ...node,
            expanded: false,
            children: node.children.map((node) =>
                colapseAllNodesRecursive(node)
            ),
        };
    } else {
        return node;
    }
}
