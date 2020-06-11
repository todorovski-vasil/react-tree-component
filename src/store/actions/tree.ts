import * as actionTypes from './actionTypes';

interface NodeAction {
    type: string;
    payload: string;
}

export type ActionInterface = NodeAction;

export const actions = {
    colapseNode: (nodeId: string): ActionInterface => ({
        type: actionTypes.COLAPSE_NODE,
        payload: nodeId,
    }),
};
