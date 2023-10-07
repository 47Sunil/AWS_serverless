import AWS from "aws-sdk";
const db = new AWS.DynamoDB.DocumentClient();
export const Table = "users";

// Function to create user
export const createUser = async (event) => {
  try {
    let body = event.body;
    body = JSON.parse(body);
    const name = body.name;
    console.log({ body, name, event });
    if (!body.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name is required" }),
      };
    }
    const id = Date.now().toString();
    const params = {
      TableName: Table,
      Item: {
        id: Number(id),
        Name: body.name,
      },
    };

    console.log(event, "event");

    await db.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Name stored successfully in DynamoDB" }),
    };
  } catch (error) {
    console.error("Error storing name in DynamoDB:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};

// Function to update a user by ID
export const updateUser = async (event) => {
  try {
    const userId = event.pathParameters.id;
    const body = JSON.parse(event.body);

    if (!body.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name is required" }),
      };
    }

    const params = {
      TableName: Table,
      Key: { id: userId },
      UpdateExpression: "SET #name = :name",
      ExpressionAttributeNames: { "#name": "Name" },
      ExpressionAttributeValues: { ":name": body.name },
    };

    await db.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User updated successfully" }),
    };
  } catch (error) {
    console.error("Error updating user:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};

// Function to delete a user by ID
export const deleteUserById = async (event) => {
  try {
    const userId = event.pathParameters.id;

    const params = {
      TableName: Table,
      Key: { id: userId },
    };

    await db.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting user:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};

// Function to get all users
export const getAllUsers = async () => {
  try {
    const params = {
      TableName: Table,
    };

    const result = await db.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error("Error getting all users:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};

// Function to get a user by ID
export const getUserById = async (event) => {
  try {
    const userId = event.pathParameters.id;

    const params = {
      TableName: Table,
      Key: { id: userId },
    };

    const result = await db.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error getting user:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
