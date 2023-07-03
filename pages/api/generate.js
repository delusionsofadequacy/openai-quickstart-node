import { Configuration, OpenAIApi } from "openai";

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

  // const animal = req.body.animal || '';
  // if (animal.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       message: "Please enter a valid animal",
  //     }
  //   });
  //   return;
  // }

  const plant = req.body.plant || "";
  console.log("Plant resquested: " + plant);
  if (plant.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid plant",
      },
    });
    return;
  }

  const plantInfoCardText = ({plantName=plant, plantDescription, plantCare, plantColdestTemp}) => {
    const plantInfo = {
      plantName: plantName,
      plantDescription: plantDescription,
      plantCare: plantCare,
      plantColdestTemp: plantColdestTemp,
    };
    // return JSON.stringify(plantInfo);
    return plantInfo
  };

  const funcs = [
    {
      name: "plantInfoCardText",
      description: "Structure the text for the plant's info card",
      parameters: {
        type: "object",
        properties: {
          plantName: {
            type: "string",
            description: "The scientific name of the plant",
          },
          plantDescription: {
            type: "string",
            description: "A short paragraph describing the plant itself",
          },
          plantCare: {
            type: "string",
            description:
              "A short paragraph about planting the plant and caring for it",
          },
          plantColdestTemp: {
            type: "number",
            description: "Coldest winter temperature the plant can survive, in degrees Celsius."
          }
        },
        // required: ["plantName"],
      },
    },
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
      content: `Write a short info card about ${plant}.`,
    },
  ]

  try {
    // const completion = await openai.createCompletion({
    console.log("Trying to create completion...")
    const completion = await openai.createChatCompletion({
      // model: "text-davinci-003",
      model: "gpt-3.5-turbo",
      // prompt: generatePrompt(animal),
      messages: requestMessages,
      functions: funcs,
      // function_call: "auto",
      function_call: {
        name: "plantInfoCardText"
      },
      temperature: 0.1,
      // max_tokens: 500,
      // stream: true
    });
    const response_message = completion.data.choices[0].message
    if (response_message.function_call) {
      try {
      console.log("Trying to call function...")
      const available_functions = {
        plantInfoCardText: plantInfoCardText
      }
      const function_name = response_message.function_call.name;
      console.log("Calling function: " + function_name)
      const function_to_call = available_functions.function_name;
      const function_args = JSON.parse(response_message.function_call.arguments)
      console.log("arguments: " + JSON.stringify(function_args))
      // const function_response = function_to_call({
      //   plantName: function_args.plantName||"Rose",
      //   plantDescription: function_args.plantDescription||"Roses are beautiful",
      //   plantCare: function_args.plantCare||"Plant them carefully",
      //   plantColdestTemp: function_args.plantColdestTemp||"0",
      // });
      const function_response = plantInfoCardText({...function_args})
      console.log("expected response: " + JSON.stringify(function_response))
      const newMessages = [...requestMessages, response_message, {
        role: "function",
        name: function_name,
        content: function_response,
      }];
      // console.log(JSON.stringify(newMessages))
      // const second_completion = await openai.createChatCompletion({
      //   model: "gpt-3.5-turbo",
      //   messages: newMessages,
      // });
      // console.log(JSON.stringify(second_completion))
      res
      .status(200)
      // .json({ result: second_completion.data.choices[0].message.content });}
      .json({ result: function_response });}
      catch(error) {
        res
      .status(200)
      .json({ result: "something wrong with function call " + JSON.stringify(error) + " /n" + JSON.stringify(completion.data.choices[0].message) })
      }
    } else {
          res
      .status(200)
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

// function generatePrompt(animal) {
//   const capitalizedAnimal =
//     animal[0].toUpperCase() + animal.slice(1).toLowerCase();
//   return `Suggest three names for a communist animal.

// Animal: Cat
// Names: Chairman Meow, Purr-manent Revolution, Comrade Fluff
// Animal: Dog
// Names: Laika, Karl Barks, Red Paw
// Animal: ${capitalizedAnimal}
// Names:`;
// }
