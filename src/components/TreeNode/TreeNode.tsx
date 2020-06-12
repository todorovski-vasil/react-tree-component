import React, { ReactElement } from 'react';

import classes from './TreeNode.module.css';

interface Props {
    label: string;
    id: string;
    expanded: boolean;
    colapseNode: (id: string) => void;
    expandNode: (id: string) => void;
    children?: Array<ReactElement> | null;
}

function TreeNode(props: Props) {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                console.log('klik');
                if (props.children) {
                    if (props.expanded) {
                        props.colapseNode(props.id);
                    } else {
                        props.expandNode(props.id);
                    }
                }
            }}
        >
            {props.expanded || !props.children
                ? `- ${props.label}`
                : `+ ${props.label}`}
            {props.expanded ? (
                <div className={classes.children}>{props.children}</div>
            ) : null}
        </div>
    );
}

export default TreeNode;
