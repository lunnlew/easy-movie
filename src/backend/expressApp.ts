'use strict'

import express from 'express'
import compress from 'compression'
import bodyParser from 'body-parser'
import expressWS from 'express-ws'
import application from './application';
import RenderMsg from './eventEmitter'
const routes = require('./routes')
require('./database/DataM')
require('./scraper/ScraperQueue')

const app = express()
expressWS(app)
app.use(bodyParser.json())
app.use(compress())
const allowCors = function (req: { headers: { origin: any }; method: string }, res: { header: (arg0: string, arg1: string | boolean) => void; sendStatus: (arg0: number) => void }, next: () => void) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
}
app.use(allowCors as any)
app.get('/', (req, res) => {
    res.end("welcome!!")
})
app.use('/api', routes);
// @ts-ignore
app.ws('/ws/:clientid', (ws: any) => new RenderMsg(ws, application.eventEmitter))
app.listen(6877, () => {
    console.log('Backend service listing on port http://127.0.0.1:6877')
})
module.exports = app;