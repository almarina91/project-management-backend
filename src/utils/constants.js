const STATUS_CODE = {
    ok: 200,
    created: 201,
    badRequest: 400,
    notAllowed: 401,
    notFound: 404
}

const ERROR = {
    invalidEmail: 'invalid email',
    passwordWeak:'please provide a stronger password of minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol',
    unableToLogIn: 'unable to login',
    notFound: 'not found'
}

module.exports = {STATUS_CODE, ERROR}