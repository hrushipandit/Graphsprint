package com.example.dynamodbproject.controller;

import com.example.dynamodbproject.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/tasks")
public ResponseEntity<List<Map<String, Object>>> getEmployeeTasks(@RequestParam String name) {
    try {
        List<Map<String, Object>> tasks = employeeService.getTasksForCurrentEmployee(name);
        return ResponseEntity.ok(tasks);
    } catch (Exception e) {
        return ResponseEntity.status(500).body(null);
    }
}

@PutMapping("/tasks/{taskId}/status")
    public ResponseEntity<String> updateTaskStatus(@PathVariable String taskId, @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Status is required.");
            }
            employeeService.updateTaskStatus(taskId, newStatus);
            return ResponseEntity.ok("Task status updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating task status: " + e.getMessage());
        }
    }
}