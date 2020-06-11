import React, { ReactElement } from 'react';

import classes from './TreeNode.module.css';

interface Props {
    label: string;
    children?: Array<ReactElement>;
}

function TreeNode(props: Props) {
    return (
        <div>
            {props.label}
            <div className={classes.children}>{props.children}</div>
        </div>
    );
}

export default TreeNode;
