import os
import re
from urllib.parse import quote_plus
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

# ── PostgreSQL / Supabase driver fix ─────────────────────────────────────────
# Supabase and Railway provide DATABASE_URL as  postgresql://...
# SQLAlchemy requires the explicit driver:       postgresql+psycopg2://...
# Translate automatically so the .env value is used as-is.
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgres://"):
    # Heroku-style alias
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set in backend/.env. "
        "Add your Supabase PostgreSQL connection string and restart the server."
    )


# ── Special-character password fix ───────────────────────────────────────────
# Supabase passwords can contain @, #, ?, & etc. which break standard URL
# parsing if not percent-encoded.  We detect this by checking for multiple
# '@' signs or an un-encoded '#' in the credentials section, then rebuild the
# URL with a safely-encoded password so SQLAlchemy can parse it correctly.
def _fix_db_url_encoding(url: str) -> str:
    """
    If the DATABASE_URL password contains special chars (@, #, etc.) that are
    not percent-encoded, this function extracts the raw credentials using a
    regex and rebuilds the URL with a properly encoded password.

    Pattern matched:
        scheme://username:PASSWORD@host:port/dbname[?params]

    The PASSWORD is everything between the first ':' after '://' and the
    LAST '@' before the host (because @ inside the password shifts parsing).
    """
    # Match: scheme://user:raw_password@host_and_rest
    # We grab everything after "://" up to the last "@" as credentials,
    # then the rest as host+path.
    m = re.match(
        r'^(postgresql\+psycopg2://)'    # group 1: scheme
        r'([^:]+)'                        # group 2: username (no colon)
        r':'                              # literal colon
        r'(.+)'                           # group 3: raw password + @host+path
        r'$',
        url,
        re.DOTALL
    )
    if not m:
        return url  # Cannot parse; return as-is

    scheme   = m.group(1)
    username = m.group(2)
    rest     = m.group(3)  # password_with_specials@host:port/db?params

    # Find the LAST '@' in 'rest' — everything before it is the raw password
    last_at = rest.rfind('@')
    if last_at == -1:
        return url  # No '@' found; malformed, return as-is

    raw_password = rest[:last_at]   # May contain @, #, ?, & etc.
    host_and_rest = rest[last_at + 1:]  # host:port/db?params

    # Check if the password already looks percent-encoded
    if '%' in raw_password and not any(c in raw_password for c in ['#', ' ']):
        return url  # Appears already encoded; skip

    # Percent-encode the raw password (encodes everything except unreserved chars)
    encoded_password = quote_plus(raw_password)

    rebuilt = f"{scheme}{username}:{encoded_password}@{host_and_rest}"
    return rebuilt


DATABASE_URL = _fix_db_url_encoding(DATABASE_URL)

# Create engine — tuned for Supabase PostgreSQL (PgBouncer pooler compatible)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Verify connections are alive before using them
    pool_recycle=300,        # Recycle connections every 5 min (Supabase drops idle after ~5 min)
    pool_size=5,             # Keep 5 persistent connections
    max_overflow=10,         # Allow up to 10 extra connections under load
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
