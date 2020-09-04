[![Actions Status](https://github.com/kingsimba/gitlab-api-filter/workflows/CI/badge.svg)](https://github.com/kingsimba/gitlab-api-filter/actions)

# GitLab API Filter

A delegate to limit the scope of GitLab APIs.

Sometimes, GitLab's APIs are too dangerous to be exposed fully.
This project acts as a delegate, it can control which part of the APIs are allowed.

## Installation

```bash
$ npm install -g gitlab-api-filter
```

## Setup

Create a configuration file: [gitlab-api-filter.jsonc](./gitlab-api-filter.jsonc):

`filters` contains a list of [APIs](https://docs.gitlab.com/ce/api/) that must be exposed.

`accessToken` or environment variable `GITLAB_AF_ACCESS_TOKEN` contains the Personal Access Token,
which is acquired from https://gitlab.example.com/profile/personal_access_tokens

## Start

```bash
$ gitlab-api-filter
Starting server with options...
url: https://gitlab.com
port: 8080
accessToken: xxxxxxxxxxxxxxxxxxxx
filters: [
  '/api/v4/projects',
  '/api/v4/projects/:id/repository/branches',
  '/api/v4/projects/:id/repository/tags'
]

Server started at http://localhost:8080
```