package com.example.dynamodbproject.controller;

import com.example.dynamodbproject.service.GraphService; 
import com.example.dynamodbproject.service.UserService; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/graph")
public class GraphController {

    private final UserService userService;
    private final GraphService graphService;

    // Constructor injection
    @Autowired
    public GraphController(UserService userService, GraphService graphService) {
        this.userService = userService;
        this.graphService = graphService;
    }

    @GetMapping("/relationships")
    public ResponseEntity<List<Map<String, String>>> getRelationships() {
        try {
            List<Map<String, String>> relationships = userService.getRelationships();
            return ResponseEntity.ok(relationships);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<String>> getUsers() {
        try {
            List<String> users = userService.getUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<String>> getTasks() {
        try {
            List<String> tasks = userService.getTasks();
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/epics")
    public ResponseEntity<List<String>> getEpics() {
        try {
            List<String> epics = userService.getEpics();
            return ResponseEntity.ok(epics);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/skills")
    public ResponseEntity<List<String>> getSkills() {
        try {
            List<String> skills = userService.getSkills();
            return ResponseEntity.ok(skills);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

  @PostMapping("/add-skill")
public ResponseEntity<String> addSkill(@RequestBody Map<String, String> request) {
    System.out.println("Received request: " + request);
    try {
        String skillName = request.get("skillName");
        graphService.addSkill(skillName);
        return ResponseEntity.ok("Skill added successfully!");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Failed to add skill: " + e.getMessage());
    }
}



    @PostMapping("/add-task")
    public ResponseEntity<String> addTask(@RequestBody Map<String, String> request) {
        try {
            String taskId = request.get("taskId");
            String taskName = request.get("taskName");
            graphService.addTask(taskId, taskName);
            return ResponseEntity.ok("Task added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add task: " + e.getMessage());
        }
    }

    @PostMapping("/add-epic")
    public ResponseEntity<String> addEpic(@RequestBody Map<String, String> request) {
        try {
            String epicId = request.get("epicId");
            String epicTitle = request.get("epicTitle");
            graphService.addEpic(epicId, epicTitle);
            return ResponseEntity.ok("Epic added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add epic: " + e.getMessage());
        }
    }

    @PostMapping("/add-dependency")
    public ResponseEntity<String> addDependency(@RequestBody Map<String, String> request) {
        try {
            String fromTaskId = request.get("fromTaskId");
            String toTaskId = request.get("toTaskId");
            graphService.addDependency(fromTaskId, toTaskId);
            return ResponseEntity.ok("Dependency added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add dependency: " + e.getMessage());
        }
    }
}

