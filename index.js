import axios from "axios";
import express from "express";
import cors from "cors";

import {XMLValidator} from "fast-xml-parser";

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    return res.status(200).json({status: '200', response: "data.go.kr proxy"});
})

app.get('/favicon.ico', (req, res) => {
    return res.status(404).send();
})

app.get('/*', (req, res) => {
    if (!req.query) return res.status(401).json({status: '401', response: 'bad request'});
    axios.get(`http://apis.data.go.kr/${req.params['0']}`, {params: {...req.query}}).then(async response => {
        if (XMLValidator.validate(response.data) === true) {
            return res.status(response.status).header("Content-Type", "application/xml").send(response.data);
        } else {
            return res.status(response.status).json(response.data);
        }
    }).catch(err => {
        if (err.response) {
            return res.status(err.response.status).json(err.response.data);
        } else {
            return res.status(500).json({status: '500', response: 'Internal Server Error'});
        }
    })
})

app.listen(process.env.PORT || 3001, () => {
    console.log("Proxy Server Start");
})