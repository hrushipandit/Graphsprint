package com.example.dynamodbproject.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EmployeeService {

    public List<Map<String, Object>> getTasksForCurrentEmployee() {
        // Mock data or integrate with your database/Neo4j query
        List<Map<String, Object>> tasks = new ArrayList<>();
        tasks.add(Map.of("id", "task1", "name", "Fix Bug", "status", "In Progress"));
        tasks.add(Map.of("id", "task2", "name", "Develop Feature", "status", "Completed"));
        return tasks;
    }

    public void updateTaskStatus(String taskId, String status) {
        // Update task status in the database or Neo4j
        System.out.println("Updating task " + taskId + " to status: " + status);
        // Example: Neo4j query to update status
    }
}
