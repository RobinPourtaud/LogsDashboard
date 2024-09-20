# FastAPI Log Management Application

This FastAPI application provides a robust API for managing and querying logs. It includes features for creating, reading, updating, and deleting logs, as well as advanced querying and aggregation capabilities.

## Key Features

- CRUD operations for logs
- Pagination support for log retrieval
- Advanced querying and aggregation of logs
- Database integration using SQLAlchemy
- CORS middleware for cross-origin requests

## Endpoints

1. **Create Log**
   - `POST /logs/`
   - Creates a new log entry

2. **Populate Logs**
   - `POST /populate_logs/`
   - Populates the database with sample log data

3. **Read Logs**
   - `GET /logs/`
   - Retrieves a list of logs with pagination support

4. **Read Single Log**
   - `GET /logs/{log_id}`
   - Retrieves a specific log by ID

5. **Update Log**
   - `PUT /logs/{log_id}`
   - Updates an existing log entry

6. **Delete Log**
   - `DELETE /logs/{log_id}`
   - Deletes a specific log or all logs (with `force=True`)

7. **Query Logs**
   - `POST /logs/query`
   - Performs advanced querying on logs

8. **Aggregate Logs**
   - `POST /logs/aggregate`
   - Aggregates log data based on specified criteria

## Setup and Configuration

1. The application uses FastAPI and SQLAlchemy for database operations.
2. CORS is configured to allow requests from `http://localhost` and `http://localhost:3000`.
3. Database models are automatically created on application startup.

## Error Handling

- Proper error responses are provided for scenarios like "Log not found".
- The delete operation includes a safety mechanism to prevent accidental deletion of all logs.

## Notes

- The `populate_logs/` endpoint is available for testing purposes.
- The `force` parameter in the delete operation should be used with caution as it can delete all logs.

## Dependencies

- FastAPI
- SQLAlchemy
- Pydantic (for schema definitions)

## Running the Application

Please use the docker-compose to run it and not directly the Dockerfile because you will need to run also the database.

```bash
docker-compose up
```

