package com.example.dynamodbproject.graphql;

import java.util.List;

public class UserDTO {
    private String email;
    private String name;
    private String role;
    private List<TaskDTO> tasks;
    private List<SkillDTO> skills;

    public UserDTO(String email, String name, String role, List<TaskDTO> tasks, List<SkillDTO> skills) {
        this.email = email;
        this.name = name;
        this.role = role;
        this.tasks = tasks;
        this.skills = skills;
    }

    // Getters and setters
}

class TaskDTO {
    private String id;
    private String name;

    public TaskDTO(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters and setters
}

class SkillDTO {
    private String name;

    public SkillDTO(String name) {
        this.name = name;
    }

    // Getters and setters
}
