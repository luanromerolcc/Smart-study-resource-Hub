import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
})

//get all resources
export const getResources = (page = 1) =>
    api.get(`/resources/?page=${page}`)

//get single resource
export const getResource = (id) =>
    api.get(`/resources/${id}/`)

//create new resource
export const createResource = (data) =>
    api.post('/resources/', data)

//update resource (using id)
export const updateResource = (id, data) =>
    api.put(`/resources/${id}/`, data)

//delete resource (using id)
export const deleteResource = (id) =>
    api.delete(`/resources/${id}/`)

//call smart assist
export const smartAssist = (data) =>
    api.post('/smart-assist/', data)