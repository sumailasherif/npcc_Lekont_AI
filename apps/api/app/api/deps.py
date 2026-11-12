from fastapi import Header


def current_user(x_demo_user: str | None = Header(default=None)) -> str:
    """Placeholder for real authentication.

    The scaffold trusts an optional ``X-Demo-User`` header so the UI can show
    who is acting. Replace with Supabase JWT verification before any pilot.
    """
    return x_demo_user or "demo.supervisor"
