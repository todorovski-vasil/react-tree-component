import * as actionTypes from './actionTypes';
import { Node } from '../reducers/tree';

interface NodeAction {
    type: string;
    payload?: string;
    seed?: Array<Node>;
}

export type ActionInterface = NodeAction;

export const actions = {
    expandNode: (nodeId: string): ActionInterface => ({
        type: actionTypes.EXPAND_NODE,
        payload: nodeId,
    }),

    colapseNode: (nodeId: string): ActionInterface => ({
        type: actionTypes.COLAPSE_NODE,
        payload: nodeId,
    }),

    initTree: (payload: Array<Node>): ActionInterface => {
        return {
            type: actionTypes.INIT_TREE,
            seed: payload,
        };
    },
};
