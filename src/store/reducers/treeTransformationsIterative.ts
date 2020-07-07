import { InputNode, Node } from '../../types/tree';
import { getUniqueId } from '../../util/util';

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

export const editAllNodes = (node: Node, expanded: boolean): Node => {
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
