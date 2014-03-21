# Heroku Addons

A convenience library for querying Heroku's addons API.

## Installation

```sh
npm install heroku-addons --save
```

## Usage

The library requires a `HEROKU_API_TOKEN` environment variable to authenticate
with the Heroku Platform API. Create a `.env` file with your token:

```sh
echo "HEROKU_API_TOKEN=$(heroku auth:token)" >> .env
```

Here's a sample script. Let's say it's named demo.js:

```js
var addons = require('heroku-addons')

var slugs = [
  'redistogo',
  'mongohq:sandbox',
  'runscope:starter',
  'bonsai:staging'
]

addons.mix(slugs, function(err, mix) {
  console.log(mix)
})
```

Run it using foreman, which will make the variables in your `.env` file available in the script's env:

```
foreman run node demo.js
```

The output will look something like this:

```js
{
  plans: [{
    created_at: '2013-08-05T20:50:21Z',
    default: true,
    description: 'Redis To Go Nano',
    id: '0e4db8d1-973a-40a6-8af2-06954105565c',
    name: 'redistogo:nano',
    price: [Object],
    state: 'public',
    updated_at: '2013-12-16T22:19:39Z'
  }, {
    created_at: '2013-08-05T20:50:22Z',
    default: true,
    description: 'MongoHQ MongoHQ Sandbox',
    id: 'c7a19cde-5ba0-4e85-a579-1022abdd344a',
    name: 'mongohq:sandbox',
    price: [Object],
    state: 'public',
    updated_at: '2013-12-16T22:19:40Z'
  }, {
    created_at: '2013-09-13T17:46:32Z',
    default: false,
    description: 'Runscope Starter',
    id: '85e601e0-1b99-483b-8a55-a8abbf36d9c4',
    name: 'runscope:starter',
    price: [Object],
    state: 'public',
    updated_at: '2013-12-16T22:20:02Z'
  }, {
    created_at: '2013-08-05T20:50:35Z',
    default: false,
    description: 'Bonsai Elasticsearch Staging',
    id: '0ee349b5-6088-4694-9777-b81088f6072e',
    name: 'bonsai:staging',
    price: [Object],
    state: 'public',
    updated_at: '2013-12-16T22:19:49Z'
  }],
  total: 5900
}
```

See [test/index.js](test/index.js) for more details.

## Tests

The tests are not mocked. They hit the real API, so you need to run them with
foreman to ensure the `HEROKU_API_TOKEN` environment variable is set.

```sh
echo "HEROKU_API_TOKEN=$(heroku auth:token)" >> .env
foreman run npm test
```
