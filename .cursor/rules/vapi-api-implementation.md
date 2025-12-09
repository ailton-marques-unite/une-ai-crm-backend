## Reference Documentation Structure

### 1. Assistants
- `GET /assistants` - List assistants
- `POST /assistants` — Create assistant
- `GET /assistants/{id}` — Get assistant details
- `PUT /assistants/{id}` — Update assistant
- `DELETE /assistants/{id}` — Delete assistant

### 2. Squad
- `GET /squad` — List squads
- `POST /squad` — Create squad
- `GET /squad/{id}` — Get squad details
- `PUT /squad/{id}` — Update squad
- `DELETE /squad/{id}` — Delete squad

### 3. Calls
- `GET /calls` — List calls
- `POST /calls` — Create call
- `GET /calls/{id}` — Get call details
- `PUT /calls/{id}` — Update call
- `DELETE /calls/{id}` — Delete call

### 4. Chats
- `GET /chats` — List chats
- `POST /chats` — Create chat
- `GET /chats/{id}` — Get chat details
- `PUT /chats/{id}` — Update chat
- `DELETE /chats/{id}` — Delete chat

### 5. Campaigns
- `GET /campaigns` — List campaigns
- `POST /campaigns` — Create campaign
- `GET /campaigns/{id}` — Get campaign details
- `PUT /campaigns/{id}` — Update campaign
- `DELETE /campaigns/{id}` — Delete campaign

### 6. Sessions
- `GET /sessions` — List sessions
- `POST /sessions` — Create session
- `GET /sessions/{id}` — Get session details
- `PUT /sessions/{id}` — Update session
- `DELETE /sessions/{id}` — Delete session

### 7. Phone Numbers
- `GET /phone-numbers` — List phone numbers
- `POST /phone-numbers` — Create phone number
- `GET /phone-numbers/{id}` — Get phone number details
- `PUT /phone-numbers/{id}` — Update phone number
- `DELETE /phone-numbers/{id}` — Delete phone number

### 8. Tools
- `GET /tools` — List tools
- `POST /tools` — Create tool
- `GET /tools/{id}` — Get tool details
- `PUT /tools/{id}` — Update tool
- `DELETE /tools/{id}` — Delete tool

### 9. Structured Outputs
- `GET /structured-outputs` — List structured outputs
- `POST /structured-outputs` — Create structured output
- `GET /structured-outputs/{id}` — Get structured output details
- `PUT /structured-outputs/{id}` — Update structured output
- `DELETE /structured-outputs/{id}` — Delete structured output

---

## 2. Architecture Design Notes

- **Domain-Driven Design**: Each domain (Assistants, Squad, etc.) is a module with its own controller, service, and entity.
- **RESTful API**: Endpoints follow REST conventions.
- **Modularization**: Each domain is a NestJS module, allowing for separation of concerns and scalability.
- **Testing**: Each module has its own test suite for controller and service logic.
- **Documentation**: Use Swagger/OpenAPI for endpoint documentation.

---
