import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class GraphQLController {

    private final UserRelationshipsResolver resolver;

    public GraphQLController(UserRelationshipsResolver resolver) {
        this.resolver = resolver;
    }

    @QueryMapping
    public Map<String, Object> getUserRelationships(@Argument String email) {
        return resolver.getUserRelationships(email);
    }
}
