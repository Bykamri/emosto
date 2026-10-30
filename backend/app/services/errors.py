class StoryNotFoundError(Exception):
    """Raised when a story is not found in the database."""
    def __init__(self, story_id: int):
        super().__init__(f"Story with ID {story_id} not found.")
        self.story_id = story_id