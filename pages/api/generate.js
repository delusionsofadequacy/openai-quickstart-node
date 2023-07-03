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
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
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

  const plant = req.body.plant || '';
  console.log("Plant resquested: " + plant)
  if (plant.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid plant",
      }
    });
    return;
  }

  try {
    // const completion = await openai.createCompletion({
    const completion = await openai.createChatCompletion({
      // model: "text-davinci-003",
      model: "gpt-3.5-turbo",
      // prompt: generatePrompt(animal),
      messages: [
        {
          role: 'system',
          content: 'You are a gardening advisor.',
        },
        {
          role: 'user',
          content: `Write a paragraph with a brief description of ${plant}, a paragraph about its preferred conditions, and a paragraph about planting it and caring for it.`,
        },
      ],
      temperature: 0.1,
    });
    // res.status(200).json({ result: completion.data.choices[0].text });
    res.status(200).json({ result: completion.data.choices[0].message.content });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
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
