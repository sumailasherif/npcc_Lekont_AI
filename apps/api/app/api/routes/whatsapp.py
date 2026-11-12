from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import PlainTextResponse

from app.core.config import get_settings
from app.schemas.whatsapp import SimulateRequest, SimulateResponse, WhatsAppMessage
from app.services import whatsapp

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])


@router.get("/webhook", response_class=PlainTextResponse)
def verify(request: Request) -> str:
    """Meta verification handshake."""
    params = request.query_params
    settings = get_settings()
    if (
        params.get("hub.mode") == "subscribe"
        and params.get("hub.verify_token") == settings.whatsapp_verify_token
    ):
        return params.get("hub.challenge", "")
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Verification failed")


@router.post("/webhook")
async def receive(request: Request) -> dict[str, str]:
    """Receive a Cloud API event and reply through the same command engine."""
    payload = await request.json()
    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            for message in value.get("messages", []):
                sender = message.get("from", "unknown")
                kind = "text"
                text = ""
                if message.get("type") == "text":
                    text = message.get("text", {}).get("body", "")
                elif message.get("type") == "image":
                    kind = "image"
                    text = message.get("image", {}).get("caption", "")
                if not text and kind == "text":
                    continue
                result = whatsapp.handle(sender, text, kind)
                whatsapp.send_whatsapp_message(sender, result.reply)
    return {"status": "ok"}


@router.post("/simulate", response_model=SimulateResponse)
def simulate(payload: SimulateRequest) -> SimulateResponse:
    """Local demo endpoint: same engine, no Meta credentials needed."""
    return whatsapp.handle(payload.from_number, payload.text, payload.kind)


@router.get("/messages", response_model=list[WhatsAppMessage])
def messages() -> list[WhatsAppMessage]:
    return whatsapp.list_messages()


@router.post("/reset", status_code=status.HTTP_204_NO_CONTENT)
def reset() -> None:
    whatsapp.reset()
