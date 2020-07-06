import React, { useReducer, useEffect, ReactElement, useCallback } from 'react';

import { reducer as treeReducer, Node } from './store/reducers/tree';
import { actions } from './store/actions/tree';
import TreeNode from './components/TreeNode/TreeNode';
// import mockData from './model/tree.json';
import { generateDeepTree } from './model/mockTree';

const mockData = [generateDeepTree(3000, 15)];

const recursive = false;

const genTreeNode = (
    node: Node,
    children: Array<JSX.Element>,
    expandNodeCallback: any,
    colapseNodeCallback: any
): JSX.Element => (
    <TreeNode
        key={node.id}
        id={node.id}
        expanded={node.expanded}
        label={node.label}
        expandNode={expandNodeCallback}
        colapseNode={colapseNodeCallback}
        children={children}
    />
);

function treeToComponentsRecursive(
    node: Node,
    expandNodeCallback: any,
    colapseNodeCallback: any
): ReactElement {
    return genTreeNode(
        node,
        node.children.map((child) =>
            treeToComponentsRecursive(
                child,
                expandNodeCallback,
                colapseNodeCallback
            )
        ),
        expandNodeCallback,
        colapseNodeCallback
    );
}

const treeToComponentsIterative = (
    node: Node,
    expandNodeCallback: any,
    colapseNodeCallback: any
): ReactElement => {
    interface NodeStack {
        node: Node;
        treeNodeChildren: Array<JSX.Element>;
        index: number;
        childrenProcessed: boolean;
    }

    let treeNode = genTreeNode(
        node,
        [],
        expandNodeCallback,
        colapseNodeCallback
    );
    const nodeStack: Array<NodeStack> = [];
    nodeStack.push({
        node: node,
        treeNodeChildren: [],
        index: 0,
        childrenProcessed: false,
    });

    while (nodeStack.length) {
        let current: NodeStack | undefined;
        current = nodeStack.pop() as NodeStack;

        if (!current.childrenProcessed && current.node.children.length) {
            // has children, than go deeper
            nodeStack.push(current);
            nodeStack.push({
                node: current.node.children[0],
                treeNodeChildren: [],
                index: 0,
                childrenProcessed: false,
            });
        } else {
            // doesn't have children or the children are processed
            if (nodeStack.length) {
                let parent = nodeStack.pop() as NodeStack;

                const isLastChild =
                    parent.node.children.length === current.index + 1;

                treeNode = genTreeNode(
                    current.node,
                    current.treeNodeChildren,
                    expandNodeCallback,
                    colapseNodeCallback
                );

                nodeStack.push({
                    node: parent.node,
                    treeNodeChildren: [...parent.treeNodeChildren, treeNode],
                    index: parent.index,
                    childrenProcessed: isLastChild,
                });

                if (!isLastChild) {
                    // add sibling to the stack
                    nodeStack.push({
                        node: parent.node.children[current.index + 1],
                        treeNodeChildren: [],
                        index: current.index + 1,
                        childrenProcessed: false,
                    });
                }
            } else {
                // head node
                treeNode = genTreeNode(
                    current.node,
                    current.treeNodeChildren,
                    expandNodeCallback,
                    colapseNodeCallback
                );
                return treeNode;
            }
        }
    }

    return treeNode;
};

const treeToComponents = (
    node: Node,
    expandNodeCallback: any,
    colapseNodeCallback: any
): ReactElement =>
    recursive
        ? treeToComponentsRecursive(
              node,
              expandNodeCallback,
              colapseNodeCallback
          )
        : treeToComponentsIterative(
              node,
              expandNodeCallback,
              colapseNodeCallback
          );

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
