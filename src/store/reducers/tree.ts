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

function changeExpandedFlagRecursive(
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

export const changeExpandedFlagIterative = (
    node: Node,
    id: string,
    expanded: boolean
): Node => {
    interface NodeStack {
        node: Node;
        index: number;
    }
    const nodeStack: Array<NodeStack> = [];
    nodeStack.push({ node: { ...node }, index: 0 });
    // let current: NodeStack | undefined; // = nodeStack.pop();
    let changedNode: Node = node;

    while (nodeStack.length) {
        let current: NodeStack | undefined;
        current = nodeStack.pop() as NodeStack;
        if (current.node.id === id) {
            // found node
            let changedNode = {
                ...current.node,
                expanded: expanded,
            };

            let parent = nodeStack.pop();

            // empty the stack by changing the affected nodes
            while (parent) {
                const children = [];
                for (let i = 0; i < parent.node.children.length; i++) {
                    if (i === current.index) {
                        children.push(changedNode);
                    } else {
                        children.push(parent.node.children[i]);
                    }
                }

                changedNode = { ...parent.node, children: children };
                current = parent;
                parent = nodeStack.pop();
            }

            return changedNode;
        } else {
            // we are not at a found node
            if (current.node.children.length) {
                // has children, than go deeper
                nodeStack.push(current);
                nodeStack.push({
                    node: current.node.children[0],
                    index: 0,
                });
            } else {
                // doesn't have children, move to next sibling if it exists
                if (nodeStack.length) {
                    // let parent = nodeStack.slice(-1)[0];
                    let parent = nodeStack.pop() as NodeStack;
                    // check if current is the last sibling
                    if (parent.node.children.length <= current.index + 1) {
                        // go up
                        while (nodeStack.length) {
                            let grandParent = nodeStack.pop() as NodeStack;
                            // check if parent is the last sibling
                            if (
                                grandParent.node.children.length <=
                                parent.index + 1
                            ) {
                                // last sibling, go up
                                parent = grandParent;
                            } else {
                                // not last sibling, add next sibling to stack
                                nodeStack.push(grandParent);
                                nodeStack.push({
                                    node:
                                        grandParent.node.children[
                                            parent.index + 1
                                        ],
                                    index: parent.index + 1,
                                });
                                break;
                            }
                        }
                        continue;
                    } else {
                        // add sibling to the stack
                        nodeStack.push(parent);
                        nodeStack.push({
                            node: parent.node.children[current.index + 1],
                            index: current.index + 1,
                        });
                    }
                }
            }
        }
    }

    return changedNode;
};

function changeExpandedFlag(node: Node, id: string, expanded: boolean): Node {
    return recursive
        ? changeExpandedFlagRecursive(node, id, expanded)
        : changeExpandedFlagIterative(node, id, expanded);
}

function expandNode(node: Node, id: string): Node {
    return changeExpandedFlag(node, id, true);
}

function colapseNode(node: Node, id: string): Node {
    return changeExpandedFlag(node, id, false);
}

const editAllNodes = (node: Node, expanded: boolean): Node => {
    interface NodeStack {
        node: Node;
        index: number;
        childrenProcessed: boolean;
    }
    const nodeStack: Array<NodeStack> = [];
    nodeStack.push({ node: { ...node }, index: 0, childrenProcessed: false });
    let changedNode: Node = node;

    while (nodeStack.length) {
        let current: NodeStack | undefined;
        current = nodeStack.pop() as NodeStack;

        if (!current.childrenProcessed && current.node.children.length) {
            // has children, than go deeper
            nodeStack.push(current);
            nodeStack.push({
                node: current.node.children[0],
                index: 0,
                childrenProcessed: false,
            });
        } else {
            // doesn't have children or the children are processed
            if (nodeStack.length) {
                let parent = nodeStack.pop() as NodeStack;

                const isLastChild =
                    parent.node.children.length === current.index + 1;

                if (current.childrenProcessed) {
                    let currentNode: Node;
                    if (current.node.children.length) {
                        currentNode = {
                            ...current.node,
                            expanded: expanded,
                        };
                    } else {
                        currentNode = current.node;
                    }

                    changedNode = {
                        ...parent.node,
                        // @ts-ignore
                        children: parent.node.children.map((child, index) => {
                            // @ts-ignore
                            if (index === current.index) {
                                return currentNode;
                            } else {
                                return child;
                            }
                        }),
                    };
                } else {
                    changedNode = parent.node;
                }

                nodeStack.push({
                    node: changedNode,
                    index: parent.index,
                    childrenProcessed: isLastChild,
                });

                if (!isLastChild) {
                    // add sibling to the stack
                    nodeStack.push({
                        node: parent.node.children[current.index + 1],
                        index: current.index + 1,
                        childrenProcessed: false,
                    });
                }
            } else {
                // head node
                changedNode = { ...current.node, expanded: expanded };
                return changedNode;
            }
        }
    }

    return changedNode;
};

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

export function expandAllNodes(node: Node): Node {
    return recursive ? expandAllNodesRecursive(node) : editAllNodes(node, true);
}

function colapseAllNodesRecursive(node: Node): Node {
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

export function colapseAllNodes(node: Node): Node {
    return recursive
        ? colapseAllNodesRecursive(node)
        : editAllNodes(node, false);
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
