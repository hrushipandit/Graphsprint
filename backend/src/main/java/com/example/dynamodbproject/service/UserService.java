package com.example.dynamodbproject.service;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.HashSet;
import com.example.dynamodbproject.util.JWTUtil;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.neo4j.driver.Result;
import org.neo4j.driver.Value;


@Service
public class UserService {
    private final DynamoDbClient dynamoDbClient;
    private final Driver neo4jDriver;

    // Constructor injection for both DynamoDbClient and Neo4j Driver
    public UserService(DynamoDbClient dynamoDbClient, Driver neo4jDriver) {
        this.dynamoDbClient = dynamoDbClient;
        this.neo4jDriver = neo4jDriver;
    }

    public List<String> getUsers() {
    // Use a Set to ensure unique entries
    Set<String> uniqueUsers = new HashSet<>();

    // Fetch from DynamoDB
    ScanRequest scanRequest = ScanRequest.builder()
            .tableName("Users")
            .build();

    ScanResponse scanResponse = dynamoDbClient.scan(scanRequest);
    uniqueUsers.addAll(
            scanResponse.items().stream()
                    .map(item -> item.get("PK").s().replace("USER#", ""))
                    .collect(Collectors.toSet()) // Ensure unique entries
    );

    // Fetch from Neo4j
    try (Session session = neo4jDriver.session()) {
        Result result = session.run("MATCH (u:User) RETURN u.email AS email");
        uniqueUsers.addAll(
                result.stream().map(record -> record.get("email").asString()).collect(Collectors.toSet())
        );
    }

    // Convert Set back to List and return
    return new ArrayList<>(uniqueUsers);
}

    public List<String> getTasks() {
        List<String> tasks = new ArrayList<>();

        // Fetch from Neo4j
        try (Session session = neo4jDriver.session()) {
            Result result = session.run("MATCH (t:Task) RETURN t.id AS id");
            tasks.addAll(
                    result.stream().map(record -> record.get("id").asString()).collect(Collectors.toList())
            );
        }

        return tasks;
    }

    public List<String> getEpics() {
        List<String> epics = new ArrayList<>();

        // Fetch from Neo4j
        try (Session session = neo4jDriver.session()) {
            Result result = session.run("MATCH (e:Epic) RETURN e.id AS id");
            epics.addAll(
                    result.stream().map(record -> record.get("id").asString()).collect(Collectors.toList())
            );
        }

        return epics;
    }

    public List<String> getSkills() {
        List<String> skills = new ArrayList<>();

        // Fetch from Neo4j
        try (Session session = neo4jDriver.session()) {
            Result result = session.run("MATCH (s:Skill) RETURN s.name AS name");
            skills.addAll(
                    result.stream().map(record -> record.get("name").asString()).collect(Collectors.toList())
            );
        }

        return skills;
    }

    public void assignTask(String email, String taskId) {
    System.out.println("Inside assignTask with email: " + email + ", taskId: " + taskId);
    try (Session session = neo4jDriver.session()) {
        session.writeTransaction(tx -> {
            System.out.println("Executing Cypher Query");
            tx.run("MERGE (u:User {email: $email}) " +
                   "MERGE (t:Task {id: $taskId}) " +
                   "MERGE (u)-[:ASSIGNED_TO]->(t)", 
                   Map.of("email", email, "taskId", taskId));
            return null;
        });
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Failed to assign task", e);
    }
}



    public void addSkill(String email, String skillName) {
    try (Session session = neo4jDriver.session()) {
        session.writeTransaction(tx -> {
            tx.run("MERGE (u:User {email: $email}) " +
                   "MERGE (s:Skill {name: $skillName}) " +
                   "MERGE (u)-[:HAS_SKILL]->(s)",
                   Map.of("email", email, "skillName", skillName));
            return null;
        });
    } catch (Exception e) {
        throw new RuntimeException("Failed to add skill", e);
    }
}


    public void linkTaskToEpic(String taskId, String epicId) {
    try (Session session = neo4jDriver.session()) {
        session.writeTransaction(tx -> {
            tx.run("MERGE (t:Task {id: $taskId}) " +
                   "MERGE (e:Epic {id: $epicId}) " +
                   "MERGE (t)-[:PART_OF]->(e)",
                   Map.of("taskId", taskId, "epicId", epicId));
            return null;
        });
    } catch (Exception e) {
        throw new RuntimeException("Failed to link task to epic", e);
    }
}


    public void addTaskDependency(String taskId1, String taskId2) {
    try (Session session = neo4jDriver.session()) {
        session.writeTransaction(tx -> {
            tx.run("MERGE (t1:Task {id: $taskId1}) " +
                   "MERGE (t2:Task {id: $taskId2}) " +
                   "MERGE (t1)-[:DEPENDS_ON]->(t2)",
                   Map.of("taskId1", taskId1, "taskId2", taskId2));
            return null;
        });
    } catch (Exception e) {
        throw new RuntimeException("Failed to add task dependency", e);
    }
}


    public void createUser(String email, String password, String name, String role) {
    try {
        // Debug log for DynamoDB storage
        System.out.println("Saving user to DynamoDB with email: " + email);
        
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("PK", AttributeValue.builder().s("USER#" + email).build());
        item.put("SK", AttributeValue.builder().s("METADATA").build());
        item.put("Password", AttributeValue.builder().s(password).build());
        item.put("Name", AttributeValue.builder().s(name).build());
        item.put("Role", AttributeValue.builder().s(role).build());

        PutItemRequest request = PutItemRequest.builder()
                .tableName("Users")
                .item(item)
                .build();

        dynamoDbClient.putItem(request);
        System.out.println("User saved to DynamoDB successfully.");
    } catch (Exception e) {
        System.err.println("Failed to save user in DynamoDB: " + e.getMessage());
        throw new RuntimeException("Failed to save user in DynamoDB", e);
    }

    // Debug log for Neo4j storage
    try (Session session = neo4jDriver.session()) {
        System.out.println("Connecting to Neo4j to save user with email: " + email);
        
        session.writeTransaction(tx -> {
            tx.run("CREATE (u:User {email: $email, name: $name, role: $role})",
                    Map.of("email", email, "name", name, "role", role));
            System.out.println("User node created in Neo4j.");
            return null;
        });
    } catch (Exception e) {
        System.err.println("Failed to save user in Neo4j: " + e.getMessage());
        throw new RuntimeException("Failed to save user in Neo4j", e);
    }
}


    public Map<String, AttributeValue> getUser(String email) {
        GetItemRequest request = GetItemRequest.builder()
                .tableName("Users")
                .key(Map.of(
                        "PK", AttributeValue.builder().s("USER#" + email).build(),
                        "SK", AttributeValue.builder().s("METADATA").build()
                ))
                .build();

        return dynamoDbClient.getItem(request).item();
    }

    public String loginUser(String email, String password) {
        Map<String, AttributeValue> user = getUser(email);

        if (user == null || user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        String storedPassword = user.get("Password").s();

        if (!storedPassword.equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        String role = user.get("Role").s();
        return JWTUtil.generateToken(email, role);
    }

    public List<Map<String, String>> getRelationships() {
        List<Map<String, String>> relationships = new ArrayList<>();

        try (Session session = neo4jDriver.session()) {
            Result result = session.run(
                "MATCH (u:User)-[r]->(m) " +
                "RETURN labels(u) AS fromLabel, u.email AS fromId, type(r) AS relationship, " +
                "labels(m) AS toLabel, m.id AS toId"
            );

            while (result.hasNext()) {
                var record = result.next();
                Map<String, String> rel = new HashMap<>();
                rel.put("fromLabel", record.get("fromLabel").asList(Value::asString).get(0));
                rel.put("fromId", record.get("fromId").asString());
                rel.put("relationship", record.get("relationship").asString());
                rel.put("toLabel", record.get("toLabel").asList(Value::asString).get(0));
                rel.put("toId", record.get("toId").asString());
                relationships.add(rel);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch relationships", e);
        }

        return relationships;
    }

}
