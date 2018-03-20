# Mafialibs

Still testing stuff out.

## Configuration File
This file should be named `config.json` in `JSON` format and `UTF-8` encoding and placed at the root directory of this project.
The configuration file should include the following elements:

|Category    |Element   |Description|
|-------     |-------   |---------- |
|database    |username      |username to access the database|
|database    |password      |password to access the database|
|database    |address      |IP address to access the database|
|database    |port      |port to access the database|
|database    |name      |name of the database|
|google      |client-id |client ID to access Google OAuth 2.0|
|site        |base-urls |list of possible root urls of the site|

The following is an example of the `config.json` file:
```json
{
  "database": {
    "username": "user123",
    "password": "password123",
    "address": "127.0.0.1",
    "port": "27017",
    "name": "database123"
  },
  "google": {
    "client-id": "clientid123"
  },
  "site": {
    "base-urls": [
      "http://localhost:3000/"
    ]
  }
}
```
