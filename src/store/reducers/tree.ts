import * as actionTypes from '../actions/actionTypes';
import { ActionInterface } from '../actions/tree';

export interface inputNode {
    label: string;
    children?: Array<inputNode>;
}

export interface Node {
    id: string;
    label: string;
    expanded: boolean;
    children?: Array<Node>;
}

export interface State {
    allExpanded: boolean;
    tree: Array<Node>;
}

const getUniqueId = () => (Math.random() * Math.pow(10, 15)).toFixed(0);

function nodeToState(node: inputNode): Node {
    if (node.children) {
        return {
            ...node,
            id: getUniqueId(),
            children: node.children.map((child) => nodeToState(child)),
            expanded: false,
        };
    } else {
        return {
            id: getUniqueId(),
            label: node.label,
            expanded: false,
        };
    }
}

function checkIfNodeIsExpanded(node: Node): boolean {
    if (node.children) {
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

function isAllExpanded(tree: Array<Node>): boolean {
    return tree.reduce(
        (acc: boolean, node: Node): boolean =>
            acc && checkIfNodeIsExpanded(node),
        true
    );
}

function changeExpandedFlag(node: Node, id: string, expanded: boolean): Node {
    if (node.children) {
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

function expandAllNodes(node: Node): Node {
    if (node.children) {
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
    if (node.children) {
        return {
            ...node,
            expanded: false,
            children: node.children.map((node) => colapseAllNodes(node)),
        };
    } else {
        return node;
    }
}

function expandTree(tree: Array<Node>): Array<Node> {
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
                    ? action.seed.map((node) => nodeToState(node))
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
