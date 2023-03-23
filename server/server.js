import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import {Configuration,OpenAIApi} from 'openai';

dotenv.config(); //to be able to use dotenv variables

const configuration = new Configuration({
    apiKey:process.env.OPENAI_API_KEY,
})

const openai =  new OpenAIApi(configuration);

const app = express();

//add middlewares
app.use(cors()); 
app.use(express.json()); //allow us to pass json to front end to backend 

app.get('/',async(req,res)=>{
    res.status(200).send({
        message:'Hello from CodeX',
    })
});

app.post('/',async(req,res)=>{
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000, // long responses
            top_p: 1,
            frequency_penalty: 0.5,//not going to response similar answer 
            presence_penalty: 0,
        })
        res.status(200).send({
            bot: response.data.choices[0].text,
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            error
        })

    }
})


app.listen(5000,()=>{
    console.log('server is running on http://localhost:5000');
})