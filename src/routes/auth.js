const API_HOST_WITH_VERSION = "http://localhost:5000/api/v1";

export const LOGIN_ROUTE = `${API_HOST_WITH_VERSION}/login`;
export const REGISTER_USER_ROUTE = `${API_HOST_WITH_VERSION}/user`;

export const GET_ALL_PROJECTS = `${API_HOST_WITH_VERSION}/project`;
export const CREATE_NEW_PROJECT = `${API_HOST_WITH_VERSION}/project`;

export const CREATE_NEW_USER = `${API_HOST_WITH_VERSION}/user`;
export const GET_ALL_USERS = `${API_HOST_WITH_VERSION}/user`;
export const DELETE_USER_BY_ID = `${API_HOST_WITH_VERSION}/user/:id`;

export const GET_ALL_PROJECT_MEMBERS = `${API_HOST_WITH_VERSION}/project-member?projectId={projectId}`;
export const GET_PROJECT_MEMBER_BY_ID = `${API_HOST_WITH_VERSION}/project-member/:id`;
export const DELETE_PROJECT_MEMBER_BY_ID = `${API_HOST_WITH_VERSION}/project-member/:id`;
export const UPDATE_PROJECT_MEMBER_BY_ID = `${API_HOST_WITH_VERSION}/project-member/:id`;

export const CREATE_PROJECT_MEMBER = `${API_HOST_WITH_VERSION}/project-member`;
