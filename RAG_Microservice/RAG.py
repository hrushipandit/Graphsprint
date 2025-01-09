
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
The database is a Neo4j graph database that models an agile software development environment. It contains the following types of nodes and relationships:
1. **User**: Represent team members with properties name, email, role.
2. **Task**: Represent work items with properties id and name.
3. **Skill**: Represent expertise areas with properties name.
4. **Epic**: Represent high-level goals with properties id.

Relationships between nodes:
- **ASSIGNED_TO**: Links a User to the Task they are assigned.
- **HAS_SKILL**: Links a User to the Skills they possess.
- **PART_OF**: Links a Task to an Epic it contributes to.
- **DEPENDS_ON**: Links one Task to another Task it depends on.

You are an agent that can:
1. Retrieve information using unstructured embeddings for natural language queries.
2. Execute structured Cypher queries on the graph for specific relationships or properties.
"""

prompt = PromptTemplate(template=context, input_variables=[])

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
        description="Use this tool for questions about users, such as their details or assignments. This tool generates and executes Cypher queries in the Neo4j database."
    ),
    Tool(
        name="Skills",
        func=skill_qa.run,
        description="Use this tool to find users who have specific skills such as 'C++'. This tool generates and executes Cypher queries in the Neo4j database."
    ),
    Tool(
        name="Epics",
        func=epic_qa.run,
        description="Use this tool for questions about epics, such as their associated tasks. This tool generates and executes Cypher queries in the Neo4j database."
    ),
    Tool(
        name="Graph",
        func=cypher_chain.run,
        description="Use this tool for structured Cypher queries about users, skills, tasks, and their relationships.This tool generates and executes Cypher queries in the Neo4j database."
    ),
]

agent = initialize_agent(
    tools,
    ChatOpenAI(temperature=0, model_name='gpt-4'),
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True
)

user_query = "Which Skill does the User Hrushikesh have?"
full_query = system_prompt.format() + "\n\n" + user_query

@app.get("/query")
async def query_agent(query: str):
    try:
        response = agent.run(full_query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("RAG:app", host="0.0.0.0", port=8000, reload=True)