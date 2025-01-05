package com.example.dynamodbproject.service;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class ManagerService {
    private final DynamoDbClient dynamoDbClient;
    private final Driver neo4jDriver;

    public ManagerService(DynamoDbClient dynamoDbClient, Driver neo4jDriver) {
        this.dynamoDbClient = dynamoDbClient;
        this.neo4jDriver = neo4jDriver;
    }

    // Delete Employee
    public void deleteEmployee(String email) {
        // Delete from DynamoDB
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("PK", AttributeValue.builder().s("USER#" + email).build());
        key.put("SK", AttributeValue.builder().s("METADATA").build());

        DeleteItemRequest deleteRequest = DeleteItemRequest.builder()
                .tableName("Users")
                .key(key)
                .build();

        dynamoDbClient.deleteItem(deleteRequest);

        // Delete from Neo4j
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction(tx -> {
                tx.run("MATCH (u:User {email: $email}) DETACH DELETE u",
                        Map.of("email", email));
                return null;
            });
        }
    }

    // Delete Task
    public void deleteTask(String taskId) {
        // Delete from Neo4j
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction(tx -> {
                tx.run("MATCH (t:Task {id: $taskId}) DETACH DELETE t",
                        Map.of("taskId", taskId));
                return null;
            });
        }
    }

    // Delete Skill
    public void deleteSkill(String skillName) {
        // Delete from Neo4j
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction(tx -> {
                tx.run("MATCH (s:Skill {name: $skillName}) DETACH DELETE s",
                        Map.of("skillName", skillName));
                return null;
            });
        }
    }

    // Delete Epic
    public void deleteEpic(String epicId) {
        // Delete from Neo4j
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction(tx -> {
                tx.run("MATCH (e:Epic {id: $epicId}) DETACH DELETE e",
                        Map.of("epicId", epicId));
                return null;
            });
        }
    }

    // Delete Dependency
    public void deleteDependency(String taskId1, String taskId2) {
        // Delete from Neo4j
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction(tx -> {
                tx.run("MATCH (t1:Task {id: $taskId1})-[r:DEPENDS_ON]->(t2:Task {id: $taskId2}) DELETE r",
                        Map.of("taskId1", taskId1, "taskId2", taskId2));
                return null;
            });
        }
    }
}
