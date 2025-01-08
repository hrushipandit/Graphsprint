package com.example.dynamodbproject.graphql;

import com.example.dynamodbproject.service.UserService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class UserQueryResolver implements GraphQLQueryResolver {

    private final UserService userService;

    public UserQueryResolver(UserService userService) {
        this.userService = userService;
    }

    public List<UserDTO> getUsers() {
        return userService.getUsers().stream()
                .map(email -> {
                    Map<String, String> userDetails = userService.getUserDetails(email);
                    List<String> tasks = userService.getAssignedTasks(email);
                    List<String> skills = userService.getUserSkills(email);

                    return new UserDTO(
                            email,
                            userDetails.get("Name"),
                            userDetails.get("Role"),
                            tasks.stream().map(taskId -> new TaskDTO(taskId, "Task " + taskId)).collect(Collectors.toList()),
                            skills.stream().map(SkillDTO::new).collect(Collectors.toList())
                    );
                })
                .collect(Collectors.toList());
    }
}
