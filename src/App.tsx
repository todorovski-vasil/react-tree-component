import React, { useReducer, useEffect, ReactElement, useCallback } from 'react';

import { reducer as treeReducer, Node } from './store/reducers/tree';
import { actions } from './store/actions/tree';
import TreeNode from './components/TreeNode/TreeNode';
import mockData from './model/tree.json';

function treeToComponents(
    node: Node,
    expandNodeCallback: any,
    colapseNodeCallback: any
): ReactElement {
    return (
        <TreeNode
            key={node.id}
            id={node.id}
            expanded={node.expanded}
            label={node.label}
            expandNode={expandNodeCallback}
            colapseNode={colapseNodeCallback}
        >
            {node.children.map((child) =>
                treeToComponents(child, expandNodeCallback, colapseNodeCallback)
            )}
        </TreeNode>
    );
}

function App() {
    const [state, dispatch] = useReducer(treeReducer, {
        allExpanded: false,
        tree: [{ label: 'drvo', expanded: false, id: '', children: [] }],
    });

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

    const tree = state.tree.map((child) =>
        treeToComponents(child, expandNodeCallback, colapseNodeCallback)
    );

    return (
        <div className='App'>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    if (state.allExpanded) {
                        dispatch(actions.colapseAll());
                    } else {
                        dispatch(actions.expandAll());
                    }
                }}
            >
                {state.allExpanded ? 'colapse all' : 'expand all'}
            </div>
            {tree}
        </div>
    );
}

export default React.memo(App);
