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

`blacklist` contains a list of [APIs](https://docs.gitlab.com/ce/api/) that should be blocked.
`whitelist` contains a list of [APIs](https://docs.gitlab.com/ce/api/) that should be exposed.

`accessToken` or environment variable `GITLAB_AF_ACCESS_TOKEN` contains the Personal Access Token,
which is acquired from https://gitlab.example.com/profile/personal_access_tokens

## Start

```bash
$ gitlab-api-filter
Starting server with options...
port: 8080
upstream.url: https://gitlab.xxx.com
upstream.accessToken: xxxxxxxxxxxxxxxxxxxx
blacklist: [ '/api/v4/blocked' ]
whitelist: [
  '/api/v4/projects',
  '/api/v4/projects/:id',
  '/api/v4/projects/:id/members*',
  '/api/v4/projects/:id/repository/branches',
  '/api/v4/projects/:id/repository/tags'
]
Server started at http://localhost:8080
```

## Changelog

- 1.2.0 2020-09-15 Add 'blacklist'. Rename 'filters' to 'whitelist'. Rename 'url' and 'accessToken' to 'upstream.url' and 'upstream.accessToken'.