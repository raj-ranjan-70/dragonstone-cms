import { api } from './api';

export const projectsApi = {
  /**
   * Fetch all projects.
   * GET /api/projects
   */
  getAll: () => api.get('/api/projects'),

  /**
   * Fetch a single project.
   * GET /api/projects/:id
   */
  getById: (id) => api.get(`/api/projects/${id}`),

  /**
   * Create a project.
   * POST /api/admin/projects
   * Note: The backend handles generating the id and lastUpdated automatically.
   */
  create: (projectData) => api.post('/api/admin/projects', projectData),

  /**
   * Replace the entire project identified by the ID.
   * PUT /api/admin/projects/:id
   * Send the complete updated project object.
   */
  update: (id, projectData) => api.put(`/api/admin/projects/${id}`, projectData),

  /**
   * Update only the modified fields of the specified project.
   * PATCH /api/admin/projects/:id
   */
  patch: (id, projectData) => api.patch(`/api/admin/projects/${id}`, projectData),

  /**
   * Delete the specified project.
   * DELETE /api/admin/projects/:id
   */
  delete: (id) => api.delete(`/api/admin/projects/${id}`),
};
