var assert = require("assert")
var util = require("util")
var addons = require("..")

describe('addons.getPlan()', function(){

  it('accepts an addon:plan string', function(done){
    addons.getPlan('mongohq:ssd_1g_elastic', function(err, plan) {
      assert.equal(plan.name, 'mongohq:ssd_1g_elastic')
      assert.equal(plan.description, 'MongoHQ 1 GB SSD')
      done()
    })
  })

  it('accepts an addon string with no plan', function(done){
    addons.getPlan('mongohq', function(err, plan) {
      assert.equal(plan.name, 'mongohq:sandbox')
      done()
    })
  })

})

describe('addons.mix()', function(){

  it('accepts an array and returns a mix object', function(done){
    addons.mix(['mongohq:ssd_1g_elastic'], function(err, mix) {
      assert(typeof(mix) === "object")
      assert(!util.isArray(mix))
      assert(util.isArray(mix.plans))
      done()
    })
  })

  it('returns an array of plans in the mix object', function(done){
    addons.mix(['mongohq:ssd_1g_elastic'], function(err, mix) {
      assert(util.isArray(mix.plans))
      done()
    })
  })

  it('handles addon:plan formatted slugs', function(done){
    addons.mix(['mongohq:ssd_1g_elastic'], function(err, mix) {
      assert.equal(mix.plans[0].name, 'mongohq:ssd_1g_elastic')
      assert.equal(mix.plans[0].price.cents, 1800)
      assert.equal(mix.plans[0].price.unit, 'month')
      done()
    })
  })

  it('finds the default plan, if unspecified', function(done){
    addons.mix(['mongohq'], function(err, mix) {
      assert.equal(mix.plans[0].name, 'mongohq:sandbox')
      assert.equal(mix.plans[0].price.cents, 0)
      assert.equal(mix.plans[0].price.unit, 'month')
      done()
    })
  })

  it('returns a total in the mix object', function(done){
    addons.mix(['mongohq:ssd_1g_elastic', 'memcachedcloud:100'], function(err, mix) {
      assert.equal(mix.plans[0].name, 'mongohq:ssd_1g_elastic')
      assert.equal(mix.plans[0].price.cents, 1800)
      assert.equal(mix.plans[1].price.cents, 1400)
      assert.equal(mix.totalCents, 3200)
      done()
    })
  })

  it('returns a human-friendly dollar amount total', function(done){
    addons.mix(['mongohq:ssd_1g_elastic', 'memcachedcloud:100'], function(err, mix) {
      assert.equal(mix.totalCents, 3200)
      assert.equal(mix.total, '$32/mo')
      done()
    })
  })

  it('returns free if total is zero', function(done){
    addons.mix(['heroku-postgresql'], function(err, mix) {
      assert.equal(mix.totalCents, 0)
      assert.equal(mix.total, 'Free')
      done()
    })
  })

  it('propagates errors for nonexistent addons', function(done){
    addons.mix(['nonexistent-addon'], function(err, mix) {
      assert(err)
      done()
    })
  })

  it('propagates errors for nonexistent plans',function(done){
    addons.mix(['mongohq:bad-plan'], function(err, mix) {
      assert(err)
      assert(err.body)
      assert.equal(err.body.id, "not_found")
      done()
    })
  })

  it('handles a long list of addons',function(done){
    var slugs = [
      'mongohq:sandbox',
      'redistogo',
      'runscope:starter',
      'goinstant',
      'rollbar',
      'usersnap',
      'bonsai:staging',
      'newrelic:west'
    ]

    addons.mix(slugs, function(err, mix) {
      assert(!err)
      assert(mix.plans)
      assert(mix.total)
      assert.equal(typeof(mix.totalCents), 'number')
      done()
    })
  })

})
