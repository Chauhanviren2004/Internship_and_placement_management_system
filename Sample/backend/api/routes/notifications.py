from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from api.websockets_manager import manager

router = APIRouter()

@router.websocket("/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            # Keep the connection open and listen for messages (optional)
            data = await websocket.receive_text()
            # We don't really need to do anything with received messages from the client
            # as this is mainly for server-to-client notifications
    except WebSocketDisconnect:
        manager.disconnect(user_id)
