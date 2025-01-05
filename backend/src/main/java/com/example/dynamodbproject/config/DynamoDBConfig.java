package com.example.dynamodbproject.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.ListTablesRequest;
import software.amazon.awssdk.services.dynamodb.model.ListTablesResponse;

@Configuration
public class DynamoDBConfig {

    @Value("${aws.access-key-id}")
    private String accessKeyId;

    @Value("${aws.secret-access-key}")
    private String secretAccessKey;

    @Value("${aws.region}")
    private String region;

    @Bean
    public DynamoDbClient dynamoDbClient() {
        System.out.println("=== DynamoDB Configuration Debugging ===");
        System.out.println("Connecting to DynamoDB...");
        System.out.println("Region: " + region);
        System.out.println("Access Key: " + accessKeyId);
        
        try {
            // Create the DynamoDB client
            DynamoDbClient dynamoDbClient = DynamoDbClient.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKeyId, secretAccessKey)
                    ))
                    .build();

            // Test connection by listing tables
            ListTablesRequest request = ListTablesRequest.builder().build();
            ListTablesResponse response = dynamoDbClient.listTables();
            System.out.println("Successfully connected to DynamoDB.");
            System.out.println("Tables in the account: " + response.tableNames());

            return dynamoDbClient;

        } catch (Exception e) {
            System.err.println("Failed to connect to DynamoDB:");
            e.printStackTrace();
            throw new RuntimeException("DynamoDB connection failed. Check your credentials and configuration.", e);
        }
    }
}
