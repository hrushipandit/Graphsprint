from fastapi import FastAPI, HTTPException
from langchain.graphs import Neo4jGraph
from langchain.vectorstores.neo4j_vector import Neo4jVector
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA, GraphCypherQAChain
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.chat_models import ChatOpenAI
from langchain.prompts import SystemMessagePromptTemplate, PromptTemplate
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load Neo4j configuration from environment variables
NEO4J_URL = os.getenv("NEO4J_URL")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

# Load OpenAI API key
os.environ['OPENAI_API_KEY'] = os.getenv("OPENAI_API_KEY")

# Initialize Neo4j Graph instance
graph = Neo4jGraph(
    url=NEO4J_URL,
    username=NEO4J_USERNAME,
    password=NEO4J_PASSWORD
)

# Step 1: Vector Index for Unstructured Data
vector_index = Neo4jVector.from_existing_graph(
    OpenAIEmbeddings(),
    url=NEO4J_URL,
    username=NEO4J_USERNAME,
    password=NEO4J_PASSWORD,
    index_name='tasks',
    node_label="Task",
    text_node_properties=['name'],  # Only use 'name' property
    embedding_node_property='embedding',
)

# Vector Index for Users
user_vector_index = Neo4jVector.from_existing_graph(
    OpenAIEmbeddings(),
    url=NEO4J_URL,
    username=NEO4J_USERNAME,
    password=NEO4J_PASSWORD,
    index_name='users',
    node_label="User",
    text_node_properties=['email', 'name', 'role', 'employee'],  # Text properties of User
    embedding_node_property='embedding',
)

# Vector Index for Skills
skill_vector_index = Neo4jVector.from_existing_graph(
    OpenAIEmbeddings(),
    url=NEO4J_URL,
    username=NEO4J_USERNAME,
    password=NEO4J_PASSWORD,
    index_name='skills',
    node_label="Skill",
    text_node_properties=['name'],  # Text property of Skill
    embedding_node_property='embedding',
)

# Vector Index for Epics
epic_vector_index = Neo4jVector.from_existing_graph(
    OpenAIEmbeddings(),
    url=NEO4J_URL,
    username=NEO4J_USERNAME,
    password=NEO4J_PASSWORD,
    index_name='epics',
    node_label="Epic",
    text_node_properties=['id'],  # Text property of Epic
    embedding_node_property='embedding',
)



# Step 2: Retrieval for Task-Based Q&A
vector_qa = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(),
    chain_type="stuff",
    retriever=vector_index.as_retriever()
)

# Retrieval QA for Users
user_qa = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(),
    chain_type="stuff",
    retriever=user_vector_index.as_retriever()
)

# Retrieval QA for Skills
skill_qa = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(),
    chain_type="stuff",
    retriever=skill_vector_index.as_retriever()
)

# Retrieval QA for Epics
epic_qa = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(),
    chain_type="stuff",
    retriever=epic_vector_index.as_retriever()
)


# Step 3: Cypher-Based Structured Queries
graph.refresh_schema()
cypher_chain = GraphCypherQAChain.from_llm(
    cypher_llm=ChatOpenAI(temperature=0, model_name='gpt-4'),
    qa_llm=ChatOpenAI(temperature=0),
    graph=graph,
    verbose=True,
    allow_dangerous_requests=True  # Acknowledge and enable this feature
)


# Create a PromptTemplate with the context
context = """
You are an AI assistant responsible for querying and modifying a Neo4j graph database.
Always generate and execute Cypher queries to retrieve factual data. You are free to edit and delete everything other than User field.
Do not guess or fabricate responses. If the operation is about editing, just return a response saying 'Task done'.

Schema Overview:
1. **User**: Properties - name, email, role.
2. **Task**: Properties - id, name.
3. **Skill**: Properties - name.
4. **Epic**: Properties - id.

Relationships:
- `ASSIGNED_TO`: Links User to Task.
- `HAS_SKILL`: Links User to Skill.
- `PART_OF`: Links Task to Epic.
- `DEPENDS_ON`: Links one Task to another.

**Instructions for Agent:**
1. Always generate precise Cypher queries for each question.
2. Correct any typos in the user's query (e.g., "Tasks" → "Task").
3. If uncertain about the query, ask for clarification instead of assuming.

**Example Queries:**
- "What skills does Hrushikesh have?" → Cypher: `MATCH (u:User {name: 'Hrushikesh'})-[:HAS_SKILL]->(s:Skill) RETURN s.name`
- "Which users are assigned to Task 101?" → Cypher: `MATCH (u:User)-[:ASSIGNED_TO]->(t:Task {id: '101'}) RETURN u.name`
-  Delete the Epic name 'Idk' → Cypher: 'MATCH (e:Epic {id: 'Idk'}) DETACH DELETE e'
Your response must contain only the retrieved data in natural language or a confirmation that the editing is done with 'Task done'.
"""

prompt = PromptTemplate(template=context, input_variables=["query"])

# Wrap it into a SystemMessagePromptTemplate
system_prompt = SystemMessagePromptTemplate(prompt=prompt)


# Step 4: Agent to Combine Vector and Cypher Tools
tools = [
    Tool(
        name="Tasks",
        func=vector_qa.run,
        description="Use this tool for questions about tasks or unstructured data. Write Cypher Queries"
    ),
    Tool(
        name="Users",
        func=user_qa.run,
        description="Use this tool for questions about User, such as their details or assignments. This tool generates and executes Cypher queries in the Neo4j database."
    ),
    Tool(
        name="Skills",
        func=skill_qa.run,
        description="Use this tool to find User who have specific Skill such as 'C++'. This tool generates and executes Cypher queries in the Neo4j database."
    ),
    Tool(
        name="Epics",
        func=epic_qa.run,
        description="Use this tool for questions about Epic, such as their associated tasks. This tool generates and executes Cypher queries in the Neo4j database."
    ),
    Tool(
        name="Graph",
        func=cypher_chain.run,
        description="Use this tool for structured Cypher queries about User, Skill, Task, and their relationships.This tool generates and executes Cypher queries in the Neo4j database."
    ),
]

agent = initialize_agent(
    tools,
    ChatOpenAI(temperature=0, model_name='gpt-4', max_tokens=500),
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True
)

full_query = "Please execute a structured query on the above question using the Graph tool and return output in natural language: Here is further context: " + context + "\n\n"

@app.get("/query")
async def query_agent(query: str):
    try:
        query = f"The question is:\n\n{query}{full_query}"
        print(query)
        response = agent.invoke(query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("RAG:app", host="0.0.0.0", port=8000, reload=True)