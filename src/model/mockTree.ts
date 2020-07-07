import { Node } from '../types/tree';
import { getUniqueId } from '../util/util';

export const generateDeepTree = (
    depth: number = 10,
    width: number = 1
): Node => {
    const headNode: Node = {
        id: getUniqueId(),
        label: `root-${0}`,
        children: [],
        expanded: false,
    };
    const halfWidth = Math.floor(width / 2);

    let currentNode = headNode;

    for (let i = 0; i < depth; i++) {
        currentNode.children.push({
            id: getUniqueId(),
            label: `node-${i + 1}`,
            children: [],
            expanded: false,
        });
        for (let j = 0; j < halfWidth; j++) {
            currentNode.children.push({
                id: getUniqueId(),
                label: `leaf-${i + 1}-${j + 1}`,
                children: [],
                expanded: false,
            });
        }
        currentNode.children.push({
            id: getUniqueId(),
            label: `node-${i + 1}-${halfWidth + 1}`,
            children: [],
            expanded: false,
        });
        for (let j = 0; j < halfWidth; j++) {
            currentNode.children[halfWidth + 1].children.push({
                id: getUniqueId(),
                label: `leaf-${i + 1}-${j + halfWidth}`,
                children: [],
                expanded: false,
            });
        }
        currentNode = currentNode.children[0];
    }

    return headNode;
};
