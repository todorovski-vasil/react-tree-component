import * as actionTypes from '../actions/actionTypes';
import { ActionInterface } from '../actions/tree';

export interface Node {
    label: string;
    children?: Array<Node>;
}

export const initialState: Array<Node> = [
    {
        label: 'root 0',
        children: [
            {
                label: 'branch 0',
                children: [
                    {
                        label: 'branch 0 0',
                    },
                    {
                        label: 'branch 0 1',
                    },
                ],
            },
            {
                label: 'branch 1',
                children: [
                    {
                        label: 'branch 1 0',
                        children: [
                            {
                                label: 'branch 1 0 0',
                            },
                            {
                                label: 'branch 1 0 1',
                            },
                        ],
                    },
                    {
                        label: 'branch 1 1',
                    },
                ],
            },
        ],
    },
];

export const reducer = (
    state: Array<Node> = initialState,
    action: ActionInterface
) => {
    switch (action.type) {
        case actionTypes.COLAPSE_NODE:
            return state;
        default:
            return state;
    }
};
