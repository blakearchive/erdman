/// <reference path="../react/react.d.ts" />

interface ITreeViewProps {
    collapsed?: boolean,
    defaultCollapsed?: boolean,
    nodeLabel?: JSX.Element | string,
    className?: string,
    itemClassName?: string
}

declare module "react-treeview" {
    export = class TreeView extends React.Component<ITreeViewProps, any> {}
}

