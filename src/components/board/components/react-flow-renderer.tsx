"use client";

import React, { useCallback, useEffect } from 'react';
import { Background, ReactFlow, Controls, useNodesState, useEdgesState } from '@xyflow/react';
import type { Edge, Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutGrid } from 'lucide-react';

import ELK from 'elkjs/lib/elk.bundled.js';

import { DatabaseSchemaNode } from "@/components/database-schema-node";
import { TableNode } from '@/types/renderer';

import '@xyflow/react/dist/style.css';
import '../css/board.css';
import useInspectorStore, { TABS__EXPORT } from '@/stores/inspector';
import ExportButton from './export-button';
import useFlowStore from '@/stores/flow';
import Image from 'next/image';


const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.spacing.nodeNode': '150',
  'elk.layered.spacing.nodeNodeBetweenLayers': '200',
  'elk.direction': 'RIGHT',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.nodePlacement.strategy': 'SIMPLE',
  'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
};

type NodeRendererProps = {
  nodes: TableNode[],
  edges: Edge[],
}
export default function NodeRenderer({
  nodes: i__nodes,
  edges: i__edges,
}: NodeRendererProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(i__nodes);
  const [edges, setEdges] = useEdgesState(i__edges);

  const { mainSchemaText } = useInspectorStore();

  // Assign nodes and edge and auto layout them
  useEffect(() => {
    setNodes(i__nodes);
    setEdges(i__edges);

    handleAutoLayout(i__nodes, i__edges);
  }, [i__nodes, i__edges]);

  const getNodeDimensions = (node: TableNode) => ({
    width: 280,
    height: 50 + node.data.schema.length * 30
  });

  const handleAutoLayout = useCallback(async (nodes: TableNode[], edges: Edge[]) => {
    const elkGraph = {
      id: "root",
      children: nodes.map((node) => ({
        id: node.id,
        ...getNodeDimensions(node),
        // Add ports for better edge routing
        ports: node.data.schema.map((field) => {
          return {
            id: `${node.id}-${field.title}`,
            properties: {
              side: "RIGHT",
            }
          };
        })
      })),
      edges: edges.map((edge) => {
        return {
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        }
      })
    };

    try {
      const layoutGraph = await elk.layout(elkGraph, { layoutOptions: elkOptions });
      
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          // Add some offset to center the layout
          position: {
            x: layoutGraph.children?.find((n) => n.id === node.id)?.x ?? 0 + 100,
            y: layoutGraph.children?.find((n) => n.id === node.id)?.y ?? 0 + 50
          }
        }))
      );
      
    } catch (error) {
      console.error('Layout calculation failed:', error);
    }

  }, [nodes, edges, setNodes]);
  
  // Auto layout items in the beggining
  useEffect(() => {
    handleAutoLayout(nodes, edges);
  }, []);

  const { setEditorOpen } = useFlowStore();
  const { setExportOption, setCurrentTab} = useInspectorStore();

  return (
    <>
      <ReactFlow
        colorMode='dark'
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        nodeTypes={{
          databaseSchema: DatabaseSchemaNode
        }}
        nodesDraggable
      >
        {
          !edges.length && !nodes.length && (
            <div className='absolute h-full w-full pointer-events-none flex items-center justify-center'>
          <Image src="/cohesion.png" alt="Company logo" height={1000} width={1000} className='opacity-[0.02] grayscale' />
          </div>
          )
        }
        <Background color='#fff2' bgColor='var(--board-default-background)' size={2} gap={20} />
        <Controls position='bottom-left' className='-translate-y-8'/>
      </ReactFlow>
      <div className='absolute top-4 right-4 flex flex-row-reverse items-center gap-2'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                asChild
                variant="secondary"
                onClick={() => handleAutoLayout(nodes, edges)}
                className="px-3 py-2 rounded-md flex items-center justify-center gap-2"
              >
                <div>
                  <LayoutGrid />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-white text-primary'>
                Auto Layout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className='border-e-2 border-gray-500'></div>
        <div className={`flex gap-2 ${mainSchemaText.length > 0 ? "opacity-1 -translate-y-0" : "opacity-0 -translate-y-5"} transition-all`}>

          {/* <ExportButton 
            onClick={() => {
              setEditorOpen(true);
              setCurrentTab(TABS__EXPORT);
              setExportOption("django");
            }}
            imageUrl='/django_logo.jpg'
            />
          <ExportButton 
            onClick={() => {
              setEditorOpen(true);
              setCurrentTab(TABS__EXPORT);
              setExportOption("prisma");
            }}
            className='bg-white p-1'
            imageUrl='/prisma_logo.svg'
          />
          <ExportButton 
            comingSoon
            className='bg-white p-1'
            imageUrl='/drizzle_logo.svg'
          />
          <ExportButton 
            comingSoon
            className='bg-white p-1'
            imageUrl='/laravel_logo.svg'
          /> */}
        </div>
      </div>
    </>
  )
}