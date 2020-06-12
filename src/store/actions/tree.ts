import * as actionTypes from './actionTypes';
import { inputNode } from '../reducers/tree';

interface NodeAction {
    type: string;
    payload?: string;
    seed?: Array<inputNode>;
}

export type ActionInterface = NodeAction;

export const actions = {
    initTree: (payload: Array<inputNode>): ActionInterface => {
        return {
            type: actionTypes.INIT_TREE,
            seed: payload,
        };
    },

    expandNode: (nodeId: string): ActionInterface => ({
        type: actionTypes.EXPAND_NODE,
        payload: nodeId,
    }),

    colapseNode: (nodeId: string): ActionInterface => ({
        type: actionTypes.COLAPSE_NODE,
        payload: nodeId,
    }),

    expandAll: (): ActionInterface => ({
        type: actionTypes.EXPAND_ALL,
    }),

    colapseAll: (): ActionInterface => ({
        type: actionTypes.COLAPSE_ALL,
    }),
};
