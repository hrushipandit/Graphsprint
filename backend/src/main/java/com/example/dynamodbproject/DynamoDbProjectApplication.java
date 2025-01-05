package com.example.dynamodbproject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
public class DynamoDbProjectApplication {
    public static void main(String[] args) {
        System.out.println("=== Starting Application ===");
        SpringApplication.run(DynamoDbProjectApplication.class, args);
    }
}
