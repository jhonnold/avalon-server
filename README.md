## Avalon Server

### Connection Protocol

#### HTTP
Authentication is done via standard JWT Bearer tokens. All routes, except those for login and registration require this token.
#### Websocket
The application consistently pushes events via a WS connection to the client for live data display.
When connecting to the WS, a `token` parameter must be passed as well (no bearer required). All connections will be rejected without this.

---

### Endpoints

|Endpoint|Body|Event|
|:-----|:---------------:|:----------:|
|`POST /users/login`| `{ username, password }` | *N/A* |
|`POST /users`| `{ username, password, displayName }` | *N/A* |
|`GET /users/me`| *N/A* | *N/A* |
|`PUT /users/join-room`| `{ roomId }` | `room updated` |
|`PUT /users/leave-room`| *N/A* | `room updated` |
|`GET /rooms`| *N/A* | *N/A* |
|`GET /rooms/:id`| *N/A* | *N/A* |
|`POST /rooms`| `{ name }` | `room updated` |
|`DELETE /rooms/:id`| *N/A* | `room deleted` |
|`GET /games` | *N/A* | *N/A* |
|`GET /games/:id` | *N/A* | *N/A* |
|`GET /games/:id/me` | *N/A* | *N/A* |
|`POST /games` | `{ roomId }` | `game started` |
---


