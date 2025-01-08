import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const backendUrl = "http://localhost:8080/graphql"; // Update the URL if necessary

const client = new ApolloClient({
  link: new HttpLink({
    uri: backendUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Fetch the token dynamically
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
