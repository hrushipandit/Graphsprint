package com.example.dynamodbproject.service;

import org.springframework.stereotype.Service;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.neo4j.driver.Result;
import java.util.*;

@Service
public class EmployeeService {
    private final Driver neo4jDriver;

    // Constructor injection for Neo4j Driver
    public EmployeeService(Driver neo4jDriver) {
        this.neo4jDriver = neo4jDriver;
    }

    public List<Map<String, Object>> getTasksForCurrentEmployee(String employeeName) {
        List<Map<String, Object>> tasks = new ArrayList<>();

        try (Session session = neo4jDriver.session()) {
            Result result = session.run(
                "MATCH (u:User {name: $employeeName})-[:ASSIGNED_TO]->(t:Task) " +
                "RETURN t.id AS id, t.name AS name",
                Map.of("employeeName", employeeName)
            );

            while (result.hasNext()) {
                var record = result.next();
                Map<String, Object> task = new HashMap<>();
                task.put("id", record.get("id").asString());
                task.put("name", record.get("name").asString());
                tasks.add(task);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch tasks for employee: " + employeeName, e);
        }

        return tasks;
    }

    public void updateTaskStatus(String taskId, String newStatus) {
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction(tx -> {
                tx.run("MATCH (t:Task {id: $taskId}) " +
                       "SET t.status = $newStatus",
                       Map.of("taskId", taskId, "newStatus", newStatus));
                return null;
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to update task status", e);
        }
    }
}
