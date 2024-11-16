"use client"

import { use, useEffect, useRef, useState } from "react";
import { GraphCanvas, GraphCanvasRef, useSelection, GraphNode, GraphEdge } from "reagraph"
import axios from "axios";
import { useMarkets } from "@/hooks/useMarkets";
import { usePositions } from "@/hooks/usePositions";


const data: any = {
  combos: {
    "combo-1": {
      name : "Combo 1",
      markets: ["market-1", "market-2", "market-3", "market-4", "market-5"],
    },
    "combo-2": {
      name : "Combo 2",
      markets: ["market-2", "market-5", "market-6"],
    },
    "combo-3": {
      name : "Combo 3",
      markets: ["market-3", "market-4", "market-5"],
    },
  },
  markets: {
    "market-1": {
      name: "Will Trump win the election?",
      tvl: 1000000,
    },
    "market-2": {
      name: "Is Elon a reptilan?",
      tvl: 2000000,
    },
    "market-3": {
      name: "Wen $BTC to 0?",
      tvl: 1500000,
    },
    "market-4": {
      name: "Will Kiln file for IPO?",
      tvl: 500000,
    },
    "market-5": {
      name: "Is Tadej Pogacar under substances?",
      tvl: 3000000,
    },
    "market-6": {
      name: "Am I autistic?",
      tvl: 100000,
    },
  },

}


function Analytics() {

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  const graphRef = useRef<GraphCanvasRef | null>(null);

  const { markets, isLoading, isError } = useMarkets()
  const { positions, isLoading: isLoadingPos, isError: isErrorPos } = usePositions()
  console.log(markets)

  useEffect(() => {
    if (isLoading) return;
    if (isError) return;
    if (!markets) return;
    if (!positions) return;
    if (isLoadingPos) return;
    if (isErrorPos) return;
    if (nodes.length > 0 && edges.length > 0) return;

    let n: GraphNode[] = []
    Object.keys(markets!).forEach((m) => {
      const combo = markets![m];
      combo.forEach((market: any) => {
        const q = market.question;
        const icon = market.icon;

        for (const token of market.tokens) {
          const node: GraphNode = {
            id: token.token_id,
            label: `${q} - ${token.outcome}`,
            // size: market.liquidityNum / 1000000,
            icon: `/api/get-image?imageUrl=${icon}`,
          }
          n.push(node)
        }
      });
    })
    setNodes(n);

    let e: GraphEdge[] = [];
    // position is an array of array of nodeId, all the nodes in the same array are connected
    positions.forEach((position) => {
      for (let i = 0; i < position.length; i++) {
        for (let j = i + 1; j < position.length; j++) {
          const source = position[i];
          const target = position[j];
          const edge: GraphEdge = {
            id: `${source}-${target}`,
            source: source,
            target: target,
            size: 1,
          };
          e.push(edge);
        }
      }
    });
    setEdges(e);


  }, [markets, isLoading, isError, nodes, edges, isLoadingPos, isErrorPos, positions]);

  const {
    selections,
    actives,
    onNodeClick,
    onCanvasClick
  } = useSelection({
    ref: graphRef,
    nodes: nodes,
    edges: edges,
    pathSelectionType: 'all'
  });

  return <GraphCanvas draggable edgeArrowPosition="none" sizingType='default' ref={graphRef} nodes={nodes} edges={edges} selections={selections} actives={actives} onCanvasClick={onCanvasClick} onNodeClick={onNodeClick} />;
}

export default Analytics