"use client"

import { use, useEffect, useRef, useState } from "react";
import { GraphCanvas, GraphCanvasRef, useSelection, GraphNode, GraphEdge } from "reagraph"
import axios from "axios";
import { useMarkets } from "@/hooks/useMarkets";


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

const getData = async () => {
  const AxiosInstance = axios.create({
    baseURL: "https://clob.polymarket.com"
  });

  let nodeRes = (await AxiosInstance.get("/markets")).data.data.map((market: any) => {
    //   const combo = data.combos[comboKey];
    //   combo.markets.forEach((marketKey: any) => {
    //     combo.markets.forEach((marketKey2: any) => {
    //       if (marketKey !== marketKey2) {
    //         if (marketKey > marketKey2) {
    //           const temp = marketKey;
    //           marketKey = marketKey2;
    //           marketKey2 = temp;
    //         }

    //         const edge: any = edges.find((edge) => edge.source === marketKey && edge.target === marketKey2);
    //         if (edge) {
    //           edge.size += 1;
    //         } else {
    //           edges.push({
    //             id: `${marketKey}-${marketKey2}`,
    //             source: marketKey,
    //             target: marketKey2,
    //             size: 1,
    //           });

    //         }
    //       }
    //     });
    //   });
    // });

    if (market.question_id === "") {
      return null;
    }
  
    return {
      id: market.question_id,
      label: market.question,
      // icon: market.icon,
      // size: market.tvl / 1000000,
    }
  })

  nodeRes = nodeRes.filter((node: any) => node !== null);

  return nodeRes
}

function Analytics() {

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  const graphRef = useRef<GraphCanvasRef | null>(null);

  const { markets, isLoading, isError } = useMarkets()
  console.log(markets)

  useEffect(() => {
    if (isLoading) return;
    if (isError) return;
    if (!markets) return;
    if (nodes.length > 0 && edges.length > 0) return;
    let n: GraphNode[] = []
    Object.keys(markets!).forEach((m) => {
      const combo = markets![m];
      combo.forEach((market: any) => {
        const node: GraphNode = {
          id: market.id,
          label: market.question,
          size: market.liquidityNum / 1000000,
          icon: `/api/get-image?imageUrl=${market.icon}`,
        }
        n.push(node)
      });
    })
    setNodes(n);

    // generate 40 random edges between randomly picked nodes with random sizes
    let e: GraphEdge[] = [];
    for (let i = 0; i < 40; i++) {
      const source = Math.floor(Math.random() * nodes.length);
      const target = Math.floor(Math.random() * nodes.length);
      if (source !== target) {
        const edge: GraphEdge = {
          id: `${source}-${target}`,
          source: nodes[source].id,
          target: nodes[target].id,
          size: Math.random() * 10,
        };
        e.push(edge);
      }
    }
    setEdges(e);

  }, [markets, isLoading, isError, nodes, edges]);

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