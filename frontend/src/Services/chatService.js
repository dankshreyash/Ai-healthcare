/**
 * Chat API service.
 * Handles all HTTP calls to the AI chat endpoint.
 */

import apiClient from '../api/apiClient';

const chatService = {
  /**
   * Send a message to the AI chat endpoint.
   * @param {string} message - Natural language user input
   * @param {number|null} interactionId - Optional interaction context
   */
  sendMessage: (message, interactionId = null) => {
    return apiClient.post('/chat', {
      message,
      interaction_id: interactionId,
    });
  },
};

export default chatService;
