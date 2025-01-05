package com.example.dynamodbproject.controller;

import com.example.dynamodbproject.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

@RestController
@RequestMapping("/relationships")
public class RelationshipController {

    private final UserService userService;
    @Autowired
    public RelationshipController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/assign-task")
public ResponseEntity<String> assignTask(@RequestBody Map<String, String> request) {
    System.out.println("Received request: " + request);
    try {
        String email = request.get("email");
        String taskId = request.get("taskId");
        System.out.println("Assigning task " + taskId + " to user " + email);
        userService.assignTask(email, taskId);
        return ResponseEntity.ok("Task assigned successfully!");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error assigning task: " + e.getMessage());
    }
}


    @PostMapping("/add-skill")
    public ResponseEntity<String> addSkill(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String skillName = request.get("skillName");
            userService.addSkill(email, skillName);
            return ResponseEntity.ok("Skill added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding skill: " + e.getMessage());
        }
    }

    @PostMapping("/link-task-epic")
    public ResponseEntity<String> linkTaskToEpic(@RequestBody Map<String, String> request) {
        try {
            String taskId = request.get("taskId");
            String epicId = request.get("epicId");
            userService.linkTaskToEpic(taskId, epicId);
            return ResponseEntity.ok("Task linked to epic successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error linking task to epic: " + e.getMessage());
        }
    }

    @PostMapping("/add-task-dependency")
    public ResponseEntity<String> addTaskDependency(@RequestBody Map<String, String> request) {
        try {
            String taskId1 = request.get("taskId1");
            String taskId2 = request.get("taskId2");
            userService.addTaskDependency(taskId1, taskId2);
            return ResponseEntity.ok("Task dependency added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding task dependency: " + e.getMessage());
        }
    }
}
