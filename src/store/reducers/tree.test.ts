import {
    inputNodeToNode,
    checkIfNodeIsExpanded,
    isAllExpanded,
    expandAllNodes,
} from './tree';

import mockData from '../../model/tree.json';

const mockState = mockData.map(inputNodeToNode);

test('inputNode to Node conversion works', () => {
    const node = inputNodeToNode(mockData[0]);
    expect(node.label).toBe('root 0');
    expect(node.expanded).toBe(false);
    expect(typeof node.id).toBe('string');
    expect(node.children[1].children[0].children[1].label).toBe('branch 1 0 1');
    expect(node.children[1].children[0].children[1].expanded).toBe(false);
});

test('expand all nodes', () => {
    const expandedNodes = expandAllNodes(mockState[0]);
    expect(checkIfNodeIsExpanded(expandedNodes)).toBe(true);
});

test('check if node is expanded', () => {
    const testNodes = {
        id: 'tsrstr',
        label: '34',
        expanded: true,
        children: [
            {
                id: 'fsthdkc',
                label: '4',
                expanded: true,
                children: [
                    {
                        id: 'fshdkc',
                        label: 'd4',
                        expanded: false,
                        children: [],
                    },
                ],
            },
            {
                id: 'fshdkc',
                label: '4',
                expanded: true,
                children: [
                    {
                        id: 'fshdkc',
                        label: 'd4',
                        expanded: true,
                        children: [
                            {
                                id: 'fshdkc',
                                label: 'd4',
                                expanded: false,
                                children: [],
                            },
                            {
                                id: 'fshdkc',
                                label: 'd4',
                                expanded: false,
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 'fshdkc',
                        label: 'd4',
                        expanded: true,
                        children: [
                            {
                                id: 'fshdkc',
                                label: 'd4',
                                expanded: false,
                                children: [],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    expect(checkIfNodeIsExpanded(testNodes.children[0].children[0])).toBe(true);
    expect(checkIfNodeIsExpanded(testNodes.children[0])).toBe(true);

    expect(checkIfNodeIsExpanded(testNodes)).toBe(true);

    testNodes.children[0].expanded = false;

    expect(checkIfNodeIsExpanded(testNodes)).toBe(false);

    testNodes.children[0].expanded = true;
    testNodes.children[1].expanded = false;

    expect(checkIfNodeIsExpanded(testNodes)).toBe(false);

    testNodes.children[1].expanded = true;
    testNodes.children[1].children[0].expanded = false;

    expect(checkIfNodeIsExpanded(testNodes)).toBe(false);

    testNodes.children[1].children[0].expanded = true;
    testNodes.children[1].children[1].expanded = false;

    expect(checkIfNodeIsExpanded(testNodes)).toBe(false);
});
