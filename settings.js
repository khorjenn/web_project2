/**
 * Created by Joey on 7/18/2017.
 */

module.exports = {
    port: process.env.PORT || 3000,
    env: process.env.ENV || 'development',

    // Environment-dependent settings
    development: {
        db: {
            dialect: 'sqlite',
            storage: 'database.sqlite'
        }
    },
    production: {
        db: {
            dialect: 'sqlite',
            storage: 'database.sqlite'
        }
    },

    keys: {
        'google_key' : 'AIzaSyDvjB6wNmeuWdLldzbd4nXylqfyA9FAX80'
    }
};