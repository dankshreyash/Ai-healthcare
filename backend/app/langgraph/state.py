"""
LangGraph state definition.
Defines the typed state that flows through every node in the graph.
"""

from typing import Optional, Literal
from typing_extensions import TypedDict


class GraphState(TypedDict, total=False):
    """
    State shared across all LangGraph nodes.

    Fields:
        user_message:      Raw natural-language input from the user.
        intent:            Detected intent after classification.
        tool_output:       Result returned by the selected tool.
        reply:             Final human-readable response to send back.
        extracted_data:    Structured data extracted by the LLM (dict).
        interaction_id:    ID of the interaction being referenced / created.
        action:            Label describing what action was performed.
        error:             Error message if something went wrong.
    """

    user_message: str
    intent: Optional[str]
    tool_output: Optional[str]
    reply: Optional[str]
    extracted_data: Optional[dict]
    interaction_id: Optional[int]
    action: Optional[str]
    error: Optional[str]
