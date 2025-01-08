package com.example.dynamodbproject.service;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.neo4j.driver.Result; // For Neo4j query results
import org.neo4j.driver.Record; // For handling Neo4j result records
import org.springframework.stereotype.Service;

import java.util.ArrayList; // For Java ArrayList
import java.util.List; // For Java List
import java.util.Map; // For Java Map
@Service
public class GraphService {

    private final Driver neo4jDriver;

    public GraphService(Driver neo4jDriver) {
        this.neo4jDriver = neo4jDriver;
    }

    
    public void addSkill(String skillName) {
    if (skillName == null || skillName.isBlank()) {
        throw new IllegalArgumentException("Skill name cannot be null or empty");
    }

    try (Session session = neo4jDriver.session()) {
        session.writeTransaction(tx -> {
            tx.run("MERGE (s:Skill {name: $skillName})", Map.of("skillName", skillName));
            return null;
        });
    } catch (Exception e) {
        throw new RuntimeException("Failed to add skill", e);
    }
}




    public void addTask(String taskId, String taskName) {
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction(tx -> {
                tx.run("MERGE (t:Task {id: $taskId, name: $taskName})",
                        Map.of("taskId", taskId, "taskName", taskName));
                return null;
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to add task", e);
        }
    }

    public void addEpic(String epicId, String epicTitle) {
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction(tx -> {
                tx.run("MERGE (e:Epic {id: $epicId, title: $epicTitle})",
                        Map.of("epicId", epicId, "epicTitle", epicTitle));
                return null;
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to add epic", e);
        }
    }

    public void addDependency(String fromTaskId, String toTaskId) {
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction(tx -> {
                tx.run("MATCH (t1:Task {id: $fromTaskId}), (t2:Task {id: $toTaskId}) " +
                                "MERGE (t1)-[:DEPENDS_ON]->(t2)",
                        Map.of("fromTaskId", fromTaskId, "toTaskId", toTaskId));
                return null;
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to add dependency", e);
        }
    }

    // New Method: Get User Relationships
    public Map<String, Object> getUserRelationships(String email) {
        try (Session session = neo4jDriver.session()) {
            return session.readTransaction(tx -> {
                // Fetch tasks assigned to the user
                Result tasksResult = tx.run(
                        "MATCH (u:User {email: $email})-[:ASSIGNED_TO]->(t:Task) RETURN t.id AS id, t.name AS name",
                        Map.of("email", email)
                );
                List<Map<String, String>> tasks = new ArrayList<>();
                tasksResult.stream().forEach(record -> tasks.add(Map.of(
                        "id", record.get("id").asString(),
                        "name", record.get("name").asString()
                )));

                // Fetch skills associated with the user
                Result skillsResult = tx.run(
                        "MATCH (u:User {email: $email})-[:HAS_SKILL]->(s:Skill) RETURN s.name AS name",
                        Map.of("email", email)
                );
                List<Map<String, String>> skills = new ArrayList<>();
                skillsResult.stream().forEach(record -> skills.add(Map.of(
                        "name", record.get("name").asString()
                )));

                // Fetch epics the user is involved in
                Result epicsResult = tx.run(
                        "MATCH (u:User {email: $email})-[:ASSIGNED_TO]->(:Task)-[:PART_OF]->(e:Epic) RETURN e.id AS id, e.title AS title",
                        Map.of("email", email)
                );
                List<Map<String, String>> epics = new ArrayList<>();
                epicsResult.stream().forEach(record -> epics.add(Map.of(
                        "id", record.get("id").asString(),
                        "title", record.get("title").asString()
                )));

                // Return relationships as a map
                return Map.of(
                        "email", email,
                        "tasks", tasks,
                        "skills", skills,
                        "epics", epics
                );
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user relationships", e);
        }
    }
}
