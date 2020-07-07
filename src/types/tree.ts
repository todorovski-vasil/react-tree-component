export interface InputNode {
    label: string;
    children?: Array<InputNode>;
    // [key: string]: any;
}

export interface Node {
    id: string;
    label: string;
    expanded: boolean;
    children: Array<Node>;
}
