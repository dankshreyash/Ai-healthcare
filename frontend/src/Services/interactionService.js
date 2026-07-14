/**
 * Interaction API service.
 * All HTTP calls related to interaction CRUD operations.
 */

import apiClient from '../api/apiClient';

const interactionService = {
  /**
   * Fetch paginated list of interactions.
   * @param {Object} params - { skip, limit, search }
   */
  getAll: (params = {}) => {
    return apiClient.get('/interaction', { params });
  },

  /**
   * Fetch a single interaction by ID.
   * @param {number} id
   */
  getById: (id) => {
    return apiClient.get(`/interaction/${id}`);
  },

  /**
   * Create a new interaction.
   * @param {Object} data - InteractionCreate payload
   */
  create: (data) => {
    return apiClient.post('/interaction', data);
  },

  /**
   * Update an existing interaction.
   * @param {number} id
   * @param {Object} data - InteractionUpdate payload (partial)
   */
  update: (id, data) => {
    return apiClient.put(`/interaction/${id}`, data);
  },

  /**
   * Delete an interaction.
   * @param {number} id
   */
  delete: (id) => {
    return apiClient.delete(`/interaction/${id}`);
  },
};

export default interactionService;
