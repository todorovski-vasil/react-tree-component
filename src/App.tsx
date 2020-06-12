import React, { useReducer, useEffect, ReactElement, useCallback } from 'react';

import { reducer as treeReducer, State } from './store/reducers/tree';
import { actions } from './store/actions/tree';
import TreeNode from './components/TreeNode/TreeNode';
import mockData from './model/tree.json';

function stateToComponents(
    state: State,
    expandNodeCallback: any,
    colapseNodeCallback: any
): ReactElement {
    return (
        <TreeNode
            key={state.id}
            id={state.id}
            expanded={state.expanded}
            label={state.label}
            expandNode={expandNodeCallback}
            colapseNode={colapseNodeCallback}
        >
            {state.children
                ? state.children.map((child) =>
                      stateToComponents(
                          child,
                          expandNodeCallback,
                          colapseNodeCallback
                      )
                  )
                : null}
        </TreeNode>
    );
}

function App() {
    const [state, dispatch] = useReducer(treeReducer, [
        { label: 'drvo', expanded: false, id: '' },
    ]);

    useEffect(() => {
        dispatch(actions.initTree(mockData));
    }, []);

    const expandNodeCallback = useCallback(
        (id) => {
            console.log('клик callback');
            dispatch(actions.expandNode(id));
        },
        [dispatch]
    );

    const colapseNodeCallback = useCallback(
        (id) => {
            console.log('клик callback');
            dispatch(actions.colapseNode(id));
        },
        [dispatch]
    );

    const tree = state.map((child) =>
        stateToComponents(child, expandNodeCallback, colapseNodeCallback)
    );

    return <div className='App'>{tree}</div>;
}

export default App;
