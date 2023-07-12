const plantLibraryEntry = ({plantCommonName=plant, plantScientificName, plantDescription, plantingAdvice, seasonalAdvice, plantHardiness, bloomingStartMonth, bloomingEndMonth, image_url, plantHeight}) => {
    const year = new Date().getFullYear();
    const plantInfo = {
      common_name: plantCommonName,
      scientific_name: plantScientificName,
      description: plantDescription,
      hardiness: plantHardiness,
      bloomingPeriod: {
        start: new Date(year, bloomingStartMonth-1, 1),
        end: new Date(year, bloomingEndMonth-1, 1),
      },
      care_advice: {
        planting: plantingAdvice,
        seasonal_care: seasonalAdvice,
        watering: "PLACEHOLDER: water weekly until soil is moist",
        fertilizing: "PLACEHOLDER: no stimulants needed",
        diseases: "Common disease 1, common disease 2, common disease 3"
      },
      image_url: image_url,
      dimensions: plantHeight
    };
    return plantInfo
  };

  const plantLibraryEntrySchema = {
    name: "plantLibraryEntry",
    description: "Structure the text for the plant's database entry",
    parameters: {
      type: "object",
      properties: {
        plantCommonName: {
          type: "string",
          description: "The common name of the plant",
        },
        plantScientificName: {
          type: "string",
          description: "The Latin name of the plant",
        },
        plantDescription: {
          type: "string",
          description: "A short paragraph describing the plant itself",
        },
        plantingAdvice: {
            type: "string",
            description:
              "A short paragraph about planting the plant",
          },
        seasonalAdvice: {
          type: "string",
          description:
            "A short paragraph about caring for the plant in summer and autumn",
        },
        plantHardiness: {
          type: "string",
          description: "USDA hardiness zones recommended for the plant"
        },
        bloomingStartMonth: {
            type: "number",
            description: "Month when the plant typically begins blooming, from 1 to 12"
        },
        bloomingStartMonth: {
            type: "number",
            description: "Month when the plant typically concludes blooming, from 1 to 12"
        },
        image_url: {
            type: "string",
            description: "URL of an image that shows the plant"
        },
        plantHeight: {
            type: "string",
            description: "Typical height of the mature plant, in cm"
        }
      },
      // required: ["plantName"],
    },
  }

  export { plantLibraryEntry, plantLibraryEntrySchema };