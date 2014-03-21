var async = require('async')
var Heroku = require('heroku-client')
var heroku = new Heroku({token: process.env.HEROKU_API_TOKEN})

var addons = module.exports = {}

addons.getPlan = function(slug, cb) {

  if (slug.match(/:/)) {
    // format is 'addon:plan'
    var addon = slug.split(":")[0]
    var plan = slug.split(":")[1]
    heroku.get('/addon-services/'+addon+'/plans/'+plan, function(err, plan) {
      if (err) return cb(err)
      cb(null, plan)
    })
  } else {
    // plan not specified; find the default plan
    heroku.get('/addon-services/'+slug+'/plans', function(err, plans) {
      if (err) return cb(err)

      var defaultPlan = plans.filter(function(plan) { return plan.default })[0]
      cb(null, defaultPlan)
    })
  }

}

addons.mix = function(slugs, cb) {
  async.map(slugs, addons.getPlan, function(err, plans) {
    if (err) return cb(err)

    var mix = {}
    mix.plans = plans

    mix.totalCents = plans.reduce(function(sum, plan) {
      return plan.price.cents + sum
    }, 0)

    if (mix.totalCents === 0) {
      mix.total = "Free"
    } else {
      mix.total = "$" + mix.totalCents/100 + "/mo"
    }

    cb(null, mix)
  })
}
