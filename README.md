# GitLab API Filter

A delegate to expose a selected subset of GitLab APIs.

Sometimes, GitLab's full APIs are too dangerous to be exposed fully.
This project acts as a delegate, it can control which part of the API are allowed.

The config file is [gitlab-api-filter.jsonc](./gitlab-api-filter.jsonc):

```
{
    "port": 8080,
    "url": "https://gitlab.example.com",

    "accessToken": "",

    "filters": [
        "/api/v4/projects",
        "/api/v4/projects/:id/repository/branches",
        "/api/v4/projects/:id/repository/tags"
    ]
}
```

`filters` contains a list of [APIs](https://docs.gitlab.com/ce/api/) that must be exposed.

`accessToken` or environment variable `GITLAB_AF_ACCESS_TOKEN` contains the Personal Access Token,
which is acquired from https://gitlab.example.com/profile/personal_access_tokens
