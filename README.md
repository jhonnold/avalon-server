## Avalon Server

### Connection Protocol

#### Websocket
In order to communicate with this server, there must be an active websocket connection. 
The handshake URL should include a `name` query parameter (*the user's desired visual name*).
Upon handshake completion the application fires a `handshake complete` message which returns the clients ID.
#### HTTP
All HTTP requests made to the server must include basic auth. The `username` is the `name` query parameter
sent on the initial websocket handshake. The `password` is the `clientId` that was replied by via `handshake complete`.

**NON-GET** HTTP requests will tend not to return values just the relevant HTTP codes. Data will come via websocket
in order to have all clients recieve the necessary information.

---

### Endpoints

|Endpoint|Body (if necessary)|Websocket event|
|:-----|:---------------:|:----------:|
|`GET /rooms`| *N/A* | *N/A* |
|`POST /rooms`| `{ name }` | `room created` |
|`PUT /rooms/:roomId/join`| *N/A* | `room updated` |
|`PUT /rooms/:roomId/leave`| *N/A* | `room updated` |
|`DELETE /rooms/:roomId`| *N/A* | `room deleted` |

---


