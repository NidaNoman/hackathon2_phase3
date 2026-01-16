"""Entry point for the Todo Console App."""

import sys
from pathlib import Path

# Add src directory to Python path so imports work
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

if __name__ == "__main__":
    from main import main
    main()
