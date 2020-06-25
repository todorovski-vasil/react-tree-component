import * as actionTypes from '../actions/actionTypes';
import { ActionInterface } from '../actions/tree';

const recursive = false;

export interface InputNode {
    label: string;
    children?: Array<InputNode>;
    // [key: string]: any;
}

export interface InputNodeFlat {
    label: string;
    parentIndex: number;
    index: number;
}

export interface Node {
    id: string;
    label: string;
    expanded: boolean;
    children: Array<Node>;
}

export interface State {
    allExpanded: boolean;
    tree: Array<Node>;
}

const getUniqueId = () => (Math.random() * Math.pow(10, 15)).toFixed(0);

export const inputNodeToNodeRecursive = (inputNode: InputNode): Node => ({
    id: getUniqueId(),
    label: inputNode.label,
    children: inputNode.children
        ? inputNode.children.map((child) => inputNodeToNodeRecursive(child))
        : [],
    expanded: false,
});

export function inputNodeToNodeIterative(inputNode: InputNode): Node {
    const outputNode: {
        id: string;
        label: string;
        expanded: boolean;
        children: Array<any>;
    } = {
        id: getUniqueId(),
        label: inputNode.label,
        children: inputNode.children ? inputNode.children : [],
        expanded: false,
    };
    let outputLayer = [outputNode];

    while (outputLayer.length) {
        // @ts-ignore
        outputLayer = outputLayer.reduce((acc, node) => {
            if (node.children.length) {
                node.children = node.children.map((child) => ({
                    id: getUniqueId(),
                    label: child.label,
                    children: child.children ? child.children : [],
                    expanded: false,
                }));

                return [...acc, ...node.children];
            } else {
                return acc;
            }
        }, []);
    }

    return outputNode;
}

export function inputNodeToNode(inputNode: InputNode): Node {
    if (recursive) {
        return inputNodeToNodeRecursive(inputNode);
    } else {
        return inputNodeToNodeIterative(inputNode);
    }
}

export function checkIfNodeIsExpandedRecursive(node: Node): boolean {
    if (node.children.length) {
        if (!node.expanded) {
            return false;
        } else {
            return node.children.reduce(
                (acc: boolean, node: Node): boolean =>
                    acc && checkIfNodeIsExpanded(node),
                true
            );
        }
    } else {
        return true;
    }
}

export function checkIfNodeIsExpandedIterative(node: Node): boolean {
    let currentLevel: Array<Node> = [node];
    let childNodes: Array<Node>;

    do {
        childNodes = [];

        for (const currentNode of currentLevel) {
            if (currentNode.children.length) {
                if (!currentNode.expanded) {
                    return false;
                }

                childNodes = [...childNodes, ...currentNode.children];
            }
        }

        currentLevel = childNodes;
    } while (childNodes.length);

    return true;
}

export function checkIfNodeIsExpanded(node: Node): boolean {
    if (recursive) {
        return checkIfNodeIsExpandedRecursive(node);
    } else {
        return checkIfNodeIsExpandedIterative(node);
    }
}

export function isAllExpanded(tree: Array<Node>): boolean {
    return tree.reduce(
        (acc: boolean, node: Node): boolean =>
            acc && checkIfNodeIsExpanded(node),
        true
    );
}

function changeExpandedFlag(node: Node, id: string, expanded: boolean): Node {
    if (node.children.length) {
        if (node.id === id) {
            node.expanded = expanded;
            return node;
        } else {
            return {
                ...node,
                children: node.children.map((child) =>
                    changeExpandedFlag(child, id, expanded)
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

function expandNode(node: Node, id: string): Node {
    return changeExpandedFlag(node, id, true);
}

function colapseNode(node: Node, id: string): Node {
    return changeExpandedFlag(node, id, false);
}

export function expandAllNodes(node: Node): Node {
    if (node.children.length) {
        return {
            ...node,
            expanded: true,
            children: node.children.map((node) => expandAllNodes(node)),
        };
    } else {
        return node;
    }
}

function colapseAllNodes(node: Node): Node {
    if (node.children.length) {
        return {
            ...node,
            expanded: false,
            children: node.children.map((node) => colapseAllNodes(node)),
        };
    } else {
        return node;
    }
}

export function expandTree(tree: Array<Node>): Array<Node> {
    return tree.map((node) => expandAllNodes(node));
}

function colapseTree(tree: Array<Node>): Array<Node> {
    return tree.map((node) => colapseAllNodes(node));
}

export const reducer = (state: State, action: ActionInterface): State => {
    switch (action.type) {
        case actionTypes.INIT_TREE:
            return {
                ...state,
                allExpanded: false,
                tree: action.seed
                    ? action.seed.map((inputNode) => inputNodeToNode(inputNode))
                    : state.tree,
            };
        case actionTypes.EXPAND_NODE: {
            console.log(`expand: ${action.payload}`);
            const newTree = state.tree.map((node) =>
                expandNode(node, action.payload ? action.payload : '')
            );
            return {
                ...state,
                allExpanded: isAllExpanded(newTree),
                tree: newTree,
            };
        }
        case actionTypes.COLAPSE_NODE: {
            console.log(`colapse: ${action.payload}`);
            const newTree = state.tree.map((node) =>
                colapseNode(node, action.payload ? action.payload : '')
            );
            return {
                ...state,
                allExpanded: isAllExpanded(newTree),
                tree: newTree,
            };
        }
        case actionTypes.EXPAND_ALL:
            return {
                ...state,
                allExpanded: true,
                tree: expandTree(state.tree),
            };
        case actionTypes.COLAPSE_ALL:
            return {
                ...state,
                allExpanded: false,
                tree: colapseTree(state.tree),
            };
        default:
            return state;
    }
};
