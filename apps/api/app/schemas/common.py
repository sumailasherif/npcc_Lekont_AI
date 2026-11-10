from enum import StrEnum


class Sector(StrEnum):
    TEXTILE = "textile"
    FOOD = "food"
    LIGHT_ENGINEERING = "light_engineering"


class Language(StrEnum):
    EN = "en"
    FR = "fr"
    CR = "cr"


class SopStatus(StrEnum):
    DRAFT = "draft"
    GENERATED = "generated"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class RiskLevel(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class GapStatus(StrEnum):
    OPEN = "open"
    PROMOTED = "promoted"
    DISMISSED = "dismissed"
