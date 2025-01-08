import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;
import com.example.dynamodbproject.service.GraphService;
@Component
public class UserRelationshipsResolver {

    private final GraphService graphService;

    @Autowired
    public UserRelationshipsResolver(GraphService graphService) {
        this.graphService = graphService;
    }

    public Map<String, Object> getUserRelationships(String email) {
        // Call your service to get relationships
        return graphService.getUserRelationships(email);
    }
}
