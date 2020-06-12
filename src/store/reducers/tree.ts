import * as actionTypes from '../actions/actionTypes';
import { ActionInterface } from '../actions/tree';

export interface Node {
    label: string;
    children?: Array<Node>;
}

export interface State {
    id: string;
    label: string;
    expanded: boolean;
    children?: Array<State>;
}

const getUniqueId = () => (Math.random() * Math.pow(10, 15)).toFixed(0);

function nodeToState(node: Node): State {
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

function expandNode(state: State, id: string): State {
    if (state.children) {
        if (state.id === id) {
            state.expanded = true;
            return state;
        } else {
            return {
                ...state,
                children: state.children.map((child) => expandNode(child, id)),
            };
        }
    } else {
        if (state.id === id) {
            state.expanded = true;
        }

        return state;
    }
}

function colapseNode(state: State, id: string): State {
    if (state.children) {
        if (state.id === id) {
            state.expanded = false;
            return state;
        } else {
            return {
                ...state,
                children: state.children.map((child) => colapseNode(child, id)),
            };
        }
    } else {
        if (state.id === id) {
            state.expanded = false;
        }

        return state;
    }
}

export const reducer = (
    state: Array<State>,
    action: ActionInterface
): Array<State> => {
    switch (action.type) {
        case actionTypes.INIT_TREE:
            return action.seed
                ? action.seed.map((node) => nodeToState(node))
                : state;
        case actionTypes.EXPAND_NODE:
            console.log(`expand: ${action.payload}`);
            return state.map((node) =>
                expandNode(node, action.payload ? action.payload : '')
            );
        case actionTypes.COLAPSE_NODE:
            console.log(`colapse: ${action.payload}`);
            return state.map((node) =>
                colapseNode(node, action.payload ? action.payload : '')
            );
        default:
            return state;
    }
};
