import { Configuration, OpenAIApi } from "openai";
import { plantLibraryEntry, plantLibraryEntrySchema } from "../../ai_functions";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  // console.log("trying to generate")
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }
  const plant = req.body.plant || "";
  // console.log("Plant resquested: " + plant);
  if (plant.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid plant",
      },
    });
    return;
  }

  const funcs = [
    plantLibraryEntrySchema,
  ];

  const requestMessages = [
    {
      role: "system",
      content:
        "You are a gardening advisor. Write in clear, plain English, accessible to novice gardeners.",
    },
    {
      role: "user",
      // content: `Write a paragraph with a brief description of ${plant}, a paragraph about its preferred conditions, and a paragraph about planting it and caring for it.`,
      content: `Write a knowledge library entry for ${plant}.`,
    },
  ]

  try {
    console.log("Trying to create completion...")
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: requestMessages,
      functions: funcs,
      // function_call: "auto",
      function_call: {
        name: "plantLibraryEntry"
      },
      temperature: 0,
      // max_tokens: 500,
      // stream: true
    });
    const response_message = completion.data.choices[0].message
    if (response_message.function_call) {
      try {
      console.log("Trying to call function...")
      const available_functions = {
        plantLibraryEntry: plantLibraryEntry
      }
      const function_name = response_message.function_call.name;
      console.log("Calling function: " + function_name)
      const function_to_call = available_functions[function_name];
      const function_args = JSON.parse(response_message.function_call.arguments)
      // console.log("arguments: " + JSON.stringify(function_args))
      const function_response = function_to_call({...function_args});
      //console.log("Function response: " + JSON.stringify(function_response))
      res
      .status(200)
      // .json({ result: second_completion.data.choices[0].message.content });}
      .json({ result: function_response });}
      catch(error) {
        console.log(error)
        res
      .status(400)
      .json({ result: "something wrong with function call " + JSON.stringify(error) + " /n" + JSON.stringify(completion.data.choices[0].message) })
      }
    } else {
          res
      .status(400)
      .json({ result: completion.data.choices[0].message.content });
    }

  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}