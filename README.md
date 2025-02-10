# GraphSprint 🚀

## Overview
**GraphSprint** is a Proof of Concept (PoC) exploring how managers and team leads can interact with Agile workflows using cutting-edge AI. By leveraging **Graph-based Retrieval-Augmented Generation (RAG) with Neo4j**, this system allows natural language interactions to retrieve, edit, and analyze team dynamics seamlessly.

## 🔥 Key Features
- **Graph-Based RAG with Neo4j**: Enables intuitive querying of task relationships and team dynamics.
- **Natural Language Processing**: Allows users to interact with Agile workflows using simple, natural queries.
- **Task Visualization**: Displays dependencies and team collaboration patterns.
- **Editing & Management**: Supports seamless modifications within the graph database.

## 🛠 Tech Stack
| Component        | Technology |
|-----------------|------------|
| **Frontend**    | React with Bootstrap CSS |
| **Backend**     | Spring Boot |
| **Microservices** | FASTAPI-based RAG service |
| **Database**    | Neo4j for relationship management |
| **Authentication** | JWT-based Role-Based Access Control (RBAC) with DynamoDB |

## 🚀 Next Steps
1. **UI Enhancements**: Improve the frontend with a more polished Bootstrap-based interface.
2. **CI/CD Integration**: Automate deployment using GitHub Actions for seamless AWS deployment.
3. **Cloud Deployment**: Deploy RAG Microservice to AWS Lambda and the Spring Boot backend to Amazon ECS.


## 🏗 Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/graphsprint.git
   cd graphsprint
   ```
2. Install dependencies for the frontend:
   ```sh
   cd frontend
   npm install
   ```
3. Start the frontend:
   ```sh
   npm start
   ```
4. Set up the backend (Spring Boot):
   ```sh
   cd backend
   mvn spring-boot:run
   ```
5. Start the RAG Microservice:
   ```sh
   cd RAG_Microservice
   uvicorn app:main --host 0.0.0.0 --port 8000
   ```

## 🎯 How It Works
- **Ask Questions**: Use natural language to query project relationships.
- **Visualize Dependencies**: Explore task dependencies through an intuitive graph interface.
- **Modify Agile Workflows**: Easily edit, update, or delete tasks in Neo4j.

## 📌 Contributing
Interested in contributing? Follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Submit a pull request 🚀

## 📜 License
This project is licensed under the **MIT License**.

## 🔗 Stay Updated
Curious to see it in action? Stay tuned for updates as we move towards production readiness!


