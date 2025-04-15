import {ResponsiveTreeMap} from "@nivo/treemap"
import {useEffect, useState} from "react"
import {buildTree} from "@/lib/common";
import {TaxComponentProps, TreeNode} from "@/types/common";


export const DendrogramTree = ({data}: TaxComponentProps) => {
    const [treeData, setTreeData] = useState<TreeNode>()

    useEffect(() => {
        setTreeData(buildTree(data))
    }, [data]);

    if (!treeData) {
        return null
    }

    return (
        <ResponsiveTreeMap
            data={treeData}
            identity="name"
            colors={{ scheme: 'spectral' }}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            motionConfig="wobbly"
        />

    )
}