from datetime import datetime, timezone
from pathlib import Path

from pydantic_settings import SettingsConfigDict

from rdagent.core.conf import ExtendedBaseSettings


class LogSettings(ExtendedBaseSettings):
    model_config = SettingsConfigDict(env_prefix="LOG_", protected_namespaces=())

    trace_path: str = str(Path.cwd() / "log" / datetime.now(timezone.utc).strftime("%Y-%m-%d_%H-%M-%S-%f"))

    format_console: str | None = None
    """"If it is None, leave it as the default"""

    storages: dict[str, list[int | str]] = {}


LOG_SETTINGS = LogSettings()
