import React, { ReactElement } from 'react';

import classes from './TreeNode.module.css';

interface Props {
    label: string;
    id: string;
    expanded: boolean;
    colapseNode: (id: string) => void;
    expandNode: (id: string) => void;
    children: Array<ReactElement>;
}

const TreeNode = React.memo((props: Props) => {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                console.log('klik');
                if (props.children.length) {
                    if (props.expanded) {
                        props.colapseNode(props.id);
                    } else {
                        props.expandNode(props.id);
                    }
                }
            }}
        >
            {props.children.length ? (props.expanded ? `- ` : `+ `) : ' '}
            {props.label}
            {props.expanded ? (
                <div className={classes.children}>{props.children}</div>
            ) : null}
        </div>
    );
});

export default TreeNode;
