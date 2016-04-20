/// <reference path="../../typings/main.d.ts" />

interface ITreeViewProps {
    collapsed?: boolean,
    defaultCollapsed?: boolean,
    nodeLabel?: JSX.Element | string,
    className?: string,
    itemClassName?: string
}

declare module "react-treeview" {
    export = class TreeView extends __React.Component<ITreeViewProps, any> {}
}

