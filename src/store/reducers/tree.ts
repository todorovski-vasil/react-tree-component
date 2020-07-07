import * as actionTypes from '../actions/actionTypes';
import { ActionInterface } from '../actions/tree';
import {
    inputNodeToNodeRecursive,
    checkIfNodeIsExpandedRecursive,
    changeExpandedFlagRecursive,
    expandAllNodesRecursive,
    colapseAllNodesRecursive,
} from './treeTransformationsRecursive';
import {
    inputNodeToNodeIterative,
    checkIfNodeIsExpandedIterative,
    changeExpandedFlagIterative,
    editAllNodes,
} from './treeTransformationsIterative';
import { InputNode, Node } from '../../types/tree';

export interface InputNodeFlat {
    label: string;
    parentIndex: number;
    index: number;
}

export interface State {
    allExpanded: boolean;
    tree: Array<Node>;
}

export function inputNodeToNode(
    inputNode: InputNode,
    recursive: boolean
): Node {
    if (recursive) {
        return inputNodeToNodeRecursive(inputNode);
    } else {
        return inputNodeToNodeIterative(inputNode);
    }
}

export function checkIfNodeIsExpanded(node: Node, recursive: boolean): boolean {
    if (recursive) {
        return checkIfNodeIsExpandedRecursive(node);
    } else {
        return checkIfNodeIsExpandedIterative(node);
    }
}

export function isAllExpanded(tree: Array<Node>, recursive: boolean): boolean {
    return tree.reduce(
        (acc: boolean, node: Node): boolean =>
            acc && checkIfNodeIsExpanded(node, recursive),
        true
    );
}

function changeExpandedFlag(
    node: Node,
    id: string,
    expanded: boolean,
    recursive: boolean
): Node {
    return recursive
        ? changeExpandedFlagRecursive(node, id, expanded)
        : changeExpandedFlagIterative(node, id, expanded);
}

function expandNode(node: Node, id: string, recursive: boolean): Node {
    return changeExpandedFlag(node, id, true, recursive);
}

function colapseNode(node: Node, id: string, recursive: boolean): Node {
    return changeExpandedFlag(node, id, false, recursive);
}

export function expandAllNodes(node: Node, recursive: boolean): Node {
    return recursive ? expandAllNodesRecursive(node) : editAllNodes(node, true);
}

export function colapseAllNodes(node: Node, recursive: boolean): Node {
    return recursive
        ? colapseAllNodesRecursive(node)
        : editAllNodes(node, false);
}

export function expandTree(tree: Array<Node>, recursive: boolean): Array<Node> {
    return tree.map((node) => expandAllNodes(node, recursive));
}

function colapseTree(tree: Array<Node>, recursive: boolean): Array<Node> {
    return tree.map((node) => colapseAllNodes(node, recursive));
}

export const reducer = (recursive: boolean) => (
    state: State,
    action: ActionInterface
): State => {
    switch (action.type) {
        case actionTypes.INIT_TREE:
            return {
                ...state,
                allExpanded: false,
                tree: action.seed
                    ? action.seed.map((inputNode) =>
                          inputNodeToNode(inputNode, recursive)
                      )
                    : state.tree,
            };
        case actionTypes.EXPAND_NODE: {
            console.log(`expand: ${action.payload}`);
            const newTree = state.tree.map((node) =>
                expandNode(
                    node,
                    action.payload ? action.payload : '',
                    recursive
                )
            );
            return {
                ...state,
                allExpanded: isAllExpanded(newTree, recursive),
                tree: newTree,
            };
        }
        case actionTypes.COLAPSE_NODE: {
            console.log(`colapse: ${action.payload}`);
            const newTree = state.tree.map((node) =>
                colapseNode(
                    node,
                    action.payload ? action.payload : '',
                    recursive
                )
            );
            return {
                ...state,
                allExpanded: isAllExpanded(newTree, recursive),
                tree: newTree,
            };
        }
        case actionTypes.EXPAND_ALL:
            return {
                ...state,
                allExpanded: true,
                tree: expandTree(state.tree, recursive),
            };
        case actionTypes.COLAPSE_ALL:
            return {
                ...state,
                allExpanded: false,
                tree: colapseTree(state.tree, recursive),
            };
        default:
            return state;
    }
};
