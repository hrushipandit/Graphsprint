package com.example.dynamodbproject.service;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.springframework.stereotype.Service;

import java.util.Map;

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
}
