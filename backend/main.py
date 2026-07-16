from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# Enable CORS for the frontend React application running on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelinePayload(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

def is_directed_acyclic_graph(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    # Gather all node IDs
    node_ids = [node.get("id") for node in nodes if "id" in node]
    
    # Create adjacency list
    adj = {node_id: [] for node_id in node_ids}
    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        if source in adj and target in adj:
            adj[source].append(target)
            
    visited = set()
    rec_stack = set()
    
    def dfs_has_cycle(node_id: str) -> bool:
        visited.add(node_id)
        rec_stack.add(node_id)
        
        for neighbor in adj.get(node_id, []):
            if neighbor in rec_stack:
                return True # Cycle detected
            if neighbor not in visited:
                if dfs_has_cycle(neighbor):
                    return True
                    
        rec_stack.remove(node_id)
        return False

    # Check for cycles in all components
    for node_id in node_ids:
        if node_id not in visited:
            if dfs_has_cycle(node_id):
                return False # Cycle exists, hence not a DAG
                
    return True # Graph has no cycles, it's a DAG

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload):
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)
    is_dag = is_directed_acyclic_graph(payload.nodes, payload.edges)
    
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag
    }
