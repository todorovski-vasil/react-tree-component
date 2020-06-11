import React, { useReducer, ReactElement } from 'react';

import {
    reducer as treeReducer,
    initialState as initialTree,
    Node,
} from './store/reducers/tree';
import TreeNode from './components/TreeNode/TreeNode';

function stateToComponents(
    state: Node,
    dispatch: any,
    key?: number
): ReactElement {
    if (state.children) {
        return (
            <TreeNode key={key} label={state.label}>
                {state.children.map((child, index) =>
                    stateToComponents(child, dispatch, index)
                )}
            </TreeNode>
        );
    } else {
        return <TreeNode key={key} label={state.label} />;
    }
}

function App() {
    const [state, dispatch] = useReducer(treeReducer, initialTree);

    return (
        <div className='App'>
            {state.map((child, index) =>
                stateToComponents(child, dispatch, index)
            )}
        </div>
    );
}

export default App;
