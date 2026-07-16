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

def get_node_label(node: Dict[str, Any]) -> str:
    data = node.get("data", {})
    # Check common name fields we use in the workspace
    if "inputName" in data:
        return f"Input ({data['inputName']})"
    if "outputName" in data:
        return f"Output ({data['outputName']})"
    
    # Fallback to visual type titles
    node_type = node.get("type", "")
    if node_type == "customInput":
        return "Input Channel"
    elif node_type == "customOutput":
        return "Output Channel"
    elif node_type == "llm":
        return "LLM Engine"
    elif node_type == "text":
        return "Text Prompt"
    elif node_type == "math":
        op = data.get("operation", "add")
        return f"Math ({op.upper()})"
    elif node_type == "merge":
        return "Merge Strings"
    elif node_type == "delay":
        d = data.get("delay", 1)
        return f"Delay ({d}s)"
    elif node_type == "auth":
        at = data.get("authType", "apiKey")
        return f"Auth ({at.upper()})"
    elif node_type == "alert":
        lvl = data.get("alertLevel", "info")
        return f"Alert ({lvl.upper()})"
    
    return node.get("id", "Node Block")

def get_topological_sort(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> List[str]:
    node_ids = [node.get("id") for node in nodes if "id" in node]
    node_map = {node.get("id"): node for node in nodes if "id" in node}
    
    # Create adjacency list
    adj = {node_id: [] for node_id in node_ids}
    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        if source in adj and target in adj:
            adj[source].append(target)
            
    visited = set()
    post_order = []
    
    def dfs_topo(node_id: str):
        visited.add(node_id)
        for neighbor in adj.get(node_id, []):
            if neighbor not in visited:
                dfs_topo(neighbor)
        post_order.append(node_id)
        
    for node_id in node_ids:
        if node_id not in visited:
            dfs_topo(node_id)
            
    # Topological sort order is the reverse of post-order
    topo_ids = post_order[::-1]
    
    return [get_node_label(node_map[node_id]) for node_id in topo_ids if node_id in node_map]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload):
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)
    is_dag = is_directed_acyclic_graph(payload.nodes, payload.edges)
    
    topo_order = get_topological_sort(payload.nodes, payload.edges) if is_dag else []
    
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag,
        "topological_order": topo_order
    }
