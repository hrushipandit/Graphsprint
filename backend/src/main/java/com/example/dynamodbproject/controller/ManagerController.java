package com.example.dynamodbproject.controller;

import com.example.dynamodbproject.service.ManagerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manager")
public class ManagerController {
    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    // Delete Employee
    @DeleteMapping("/employees/{email}")
    @PreAuthorize("hasRole('Manager')")
    public ResponseEntity<String> deleteEmployee(@PathVariable String email) {
        try {
            managerService.deleteEmployee(email);
            return ResponseEntity.ok("Employee deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting employee: " + e.getMessage());
        }
    }

    // Delete Task
    @DeleteMapping("/tasks/{taskId}")
    @PreAuthorize("hasRole('Manager')")
    public ResponseEntity<String> deleteTask(@PathVariable String taskId) {
        try {
            managerService.deleteTask(taskId);
            return ResponseEntity.ok("Task deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting task: " + e.getMessage());
        }
    }

    // Delete Skill
    @DeleteMapping("/skills/{skillName}")
    @PreAuthorize("hasRole('Manager')")
    public ResponseEntity<String> deleteSkill(@PathVariable String skillName) {
        try {
            managerService.deleteSkill(skillName);
            return ResponseEntity.ok("Skill deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting skill: " + e.getMessage());
        }
    }

    // Delete Epic
    @DeleteMapping("/epics/{epicId}")
    @PreAuthorize("hasRole('Manager')")
    public ResponseEntity<String> deleteEpic(@PathVariable String epicId) {
        try {
            managerService.deleteEpic(epicId);
            return ResponseEntity.ok("Epic deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting epic: " + e.getMessage());
        }
    }

    // Delete Dependency
    @DeleteMapping("/dependencies")
    @PreAuthorize("hasRole('Manager')")
    public ResponseEntity<String> deleteDependency(@RequestParam String taskId1, @RequestParam String taskId2) {
        try {
            managerService.deleteDependency(taskId1, taskId2);
            return ResponseEntity.ok("Dependency deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting dependency: " + e.getMessage());
        }
    }
}
