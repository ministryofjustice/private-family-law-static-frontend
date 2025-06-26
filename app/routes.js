//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
router.post('/child-safety', function(request, response) {

    var childSafety = request.session.data['child-safety']
    if (childSafety == "yes"){
        response.redirect("/feel-bullied-or-unsafe")
    } else {
        response.redirect("/going-to-court")
    }
})

router.post('/feel-bullied-or-unsafe', function(request, response) {

    var feelBulliedOrUnsafe = request.session.data['feel-bullied-or-unsafe']
    if (feelBulliedOrUnsafe == "yes"){
        response.redirect("/going-to-court")
    } else {
        response.redirect("/child-arrangements-in-place")
    }
})

router.post('/child-arrangements-in-place', function(request, response) {

    var childArrangementsInPlace = request.session.data['child-arrangements-in-place']
    if (childArrangementsInPlace == "yes"){
        response.redirect("/existing-child-arrangements")
    } else {
        response.redirect("/contact-each-other")
    }
})

router.post('/existing-child-arrangements', function(request, response) {

    var existingChildArrangements = request.session.data['existing-child-arrangements']
    if (existingChildArrangements == "make changes"){
        response.redirect("/contact-each-other")
    } else if (existingChildArrangements == "denying") {
        response.redirect("/going-to-court")
    } else {
        response.redirect("/contact-each-other")
    }
})

router.post('/contact-each-other', function(request, response) {

    var contactEachOther = request.session.data['contact-each-other']
    if (contactEachOther == "yes"){
        response.redirect("/need-help-from-someone-else")
    } else if (contactEachOther == "no") {
        response.redirect("/when-you-are-not-in-contact")
    } else {
        response.redirect("/need-help-from-someone-else")
    }
})

router.post('/need-help-from-someone-else', function(request, response) {
    
    var contactEachOther = request.session.data['contact-each-other']
    var needHelpFromSomeoneElse = request.session.data['need-help-from-someone-else']
    if (needHelpFromSomeoneElse == "yes"){
        response.redirect("/stick-to-an-agreement")
    } else if (needHelpFromSomeoneElse == "no") {
        response.redirect("/make-a-child-arrangements-plan")
    } else if (contactEachOther == "not sure" && needHelpFromSomeoneElse == "not sure") {
        response.redirect("/not-enough-information")
    } else {
        response.redirect("/mediation")
    }
})

router.post('/stick-to-an-agreement', function(request, response) {

    var needHelpFromSomeoneElse = request.session.data['need-help-from-someone-else']
    var stickToAnAgreement = request.session.data['stick-to-an-agreement']
    if (stickToAnAgreement == "yes"){
        response.redirect("/mediation")
    } else {
        response.redirect("/arbitration")
    } 
})

// SMART ANSWERS //
router.post('/smart-answers/child-safety', function(request, response) {

    var childSafety = request.session.data['child-safety']
    if (childSafety == "yes"){
        response.redirect("/smart-answers/feel-bullied-or-unsafe")
    } else {
        response.redirect("/smart-answers/going-to-court")
    }
})

router.post('/smart-answers/feel-bullied-or-unsafe', function(request, response) {

    var feelBulliedOrUnsafe = request.session.data['feel-bullied-or-unsafe']
    if (feelBulliedOrUnsafe == "yes"){
        response.redirect("/smart-answers/going-to-court")
    } else {
        response.redirect("/smart-answers/child-arrangements-in-place")
    }
})

router.post('/smart-answers/child-arrangements-in-place', function(request, response) {

    var childArrangementsInPlace = request.session.data['child-arrangements-in-place']
    if (childArrangementsInPlace == "yes"){
        response.redirect("/smart-answers/existing-child-arrangements")
    } else {
        response.redirect("/smart-answers/contact-each-other")
    }
})

router.post('/smart-answers/existing-child-arrangements', function(request, response) {

    var existingChildArrangements = request.session.data['existing-child-arrangements']
    if (existingChildArrangements == "make changes"){
        response.redirect("/smart-answers/contact-each-other")
    } else if (existingChildArrangements == "denying") {
        response.redirect("/smart-answers/going-to-court")
    } else {
        response.redirect("/smart-answers/contact-each-other")
    }
})

router.post('/smart-answers/contact-each-other', function(request, response) {

    var contactEachOther = request.session.data['contact-each-other']
    if (contactEachOther == "yes"){
        response.redirect("/smart-answers/need-help-from-someone-else")
    } else if (contactEachOther == "no") {
        response.redirect("/smart-answers/when-you-are-not-in-contact")
    } else {
        response.redirect("/smart-answers/need-help-from-someone-else")
    }
})

router.post('/smart-answers/need-help-from-someone-else', function(request, response) {
    
    var contactEachOther = request.session.data['contact-each-other']
    var needHelpFromSomeoneElse = request.session.data['need-help-from-someone-else']
    if (needHelpFromSomeoneElse == "yes"){
        response.redirect("/smart-answers/stick-to-an-agreement")
    } else if (needHelpFromSomeoneElse == "no") {
        response.redirect("/smart-answers/make-a-child-arrangements-plan")
    } else if (contactEachOther == "not sure" && needHelpFromSomeoneElse == "not sure") {
        response.redirect("/smart-answers/not-enough-information")
    } else {
        response.redirect("/smart-answers/mediation")
    }
})

router.post('/smart-answers/stick-to-an-agreement', function(request, response) {

    var needHelpFromSomeoneElse = request.session.data['need-help-from-someone-else']
    var stickToAnAgreement = request.session.data['stick-to-an-agreement']
    if (stickToAnAgreement == "yes"){
        response.redirect("/smart-answers/mediation")
    } else {
        response.redirect("/smart-answers/arbitration")
    } 
})

