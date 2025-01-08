import React from "react";
import { useQuery, gql } from "@apollo/client";

// GraphQL Query
const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      email
      name
      role
      tasks {
        id
        name
      }
      skills {
        name
      }
    }
  }
`;

const SearchUserInfo = () => {
  const { loading, error, data } = useQuery(GET_USERS_QUERY);

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Info</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {!loading && !error && data && (
        <div style={{ marginTop: "20px" }}>
          {data.users.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Role</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Tasks</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Skills</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.email}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.name}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.email}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.role}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {user.tasks.length > 0 ? (
                        <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                          {user.tasks.map((task) => (
                            <li key={task.id}>{task.name} (ID: {task.id})</li>
                          ))}
                        </ul>
                      ) : (
                        "No Tasks"
                      )}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {user.skills.length > 0 ? (
                        <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                          {user.skills.map((skill, index) => (
                            <li key={index}>{skill.name}</li>
                          ))}
                        </ul>
                      ) : (
                        "No Skills"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUserInfo;
