var async = require('async')
var Heroku = require('heroku-client')
var heroku = new Heroku({token: process.env.HEROKU_API_TOKEN})

var addons = module.exports = {}

function formatPrice(price) {
  if (price === 0) {
    return "Free"
  } else {
    return "$" + price/100 + "/mo"
  }
}

addons.getPlan = function(slug, cb) {

  if (slug.match(/:/)) {
    // format is 'addon:plan'
    var addon = slug.split(":")[0]
    var plan = slug.split(":")[1]
    heroku.get('/addon-services/'+addon+'/plans/'+plan, function(err, plan) {
      if (err) return cb(err)
      plan.prettyPrice = formatPrice(plan.price.cents)
      cb(null, plan)
    })
  } else {
    // plan not specified; find the default plan
    heroku.get('/addon-services/'+slug+'/plans', function(err, plans) {
      if (err) return cb(err)
      var plan = plans.filter(function(plan) { return plan.default })[0]
      plan.prettyPrice = formatPrice(plan.price.cents)
      cb(null, plan)
    })
  }

}

addons.mix = function(slugs, cb) {
  async.map(slugs, addons.getPlan, function(err, plans) {
    if (err) return cb(err)

    var mix = {}

    mix.totalPriceInCents = plans.reduce(function(sum, plan) {
      return plan.price.cents + sum
    }, 0)

    mix.totalPrice = formatPrice(mix.totalPriceInCents)
    mix.plans = plans

    cb(null, mix)
  })
}
