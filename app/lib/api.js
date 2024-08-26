const BASE_URL = "http://10.144.51.20:3000";

const api = {
  // Fetch a message from the root context endpoint
  getContextMessage: async () => {
    const response = await fetch(`${BASE_URL}/context`);
    const data = await response.json();
    return data;
  },

  // Upload a text file for analysis
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/context/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  },

  // Update text for a given context_id
  updateText: async (contextId, text) => {
    const response = await fetch(`${BASE_URL}/context/update/${contextId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    return data;
  },

  // Process short text for a given context_id
  processShortText: async (contextId) => {
    const response = await fetch(`${BASE_URL}/context/process/${contextId}/short`);
    const data = await response.json();
    return data;
  },

  // Start processing text for a given context_id
  startProcessing: async (contextId) => {
    const response = await fetch(`${BASE_URL}/context/process/${contextId}/start`);
    const data = await response.json();
    return data;
  },

  // Get processing status for a given context_id
  getProcessStatus: async (contextId) => {
    const response = await fetch(`${BASE_URL}/context/process/${contextId}/status`);
    const data = await response.json();
    return data;
  },

  // Detect characters in a given text
  detectCharacters: async (text) => {
    const response = await fetch(`${BASE_URL}/context/detect/characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    return data;
  },

  // Generate image description
  generateDescription: async (file, previousContext, nextContext, tag, personalities) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("previous_context", previousContext);
    formData.append("next_context", nextContext);
    formData.append("tag", tag);
    formData.append("personalities", personalities);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch(`${BASE_URL}/rhetorics/generate-description`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  },

  // Stream-generated image description
  generateDescriptionStream: async (file, previousContext, nextContext, tag, personalities, onMessage, onError, onDone) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("previous_context", previousContext);
    formData.append("next_context", nextContext);
    formData.append("tag", tag);
    formData.append("personalities", personalities);

    try {
      const response = await fetch(`${BASE_URL}/rhetorics/generate-description-stream`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Request failed with code ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let streaming = true;
      while (streaming) {
        const { value, done } = await reader.read();
        if (done) {
          onDone && onDone();
          break;
        }

        const text = decoder.decode(value);
        text.split("\n\n").forEach((msg) => {
          if (msg.length > 0) {
            msg = msg.replace(/^data: /, "");
            const message = JSON.parse(msg);
            onMessage(message);
          }
        });
      }
    } catch (error) {
      onError(`Request failed: ${error}`);
    }
  },

  // Polish text
  polishText: async (text, previousContext, nextContext, tag, personalities) => {
    const response = await fetch(`${BASE_URL}/rhetorics/polish-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, previous_context: previousContext, next_context: nextContext, tag, personalities }),
    });
    const data = await response.json();
    return data;
  },

  // Stream-polished text
  polishTextStream: async (text, previousContext, nextContext, tag, personalities, onMessage, onError, onDone) => {
    try {
      const response = await fetch(`${BASE_URL}/rhetorics/polish-text-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, previous_context: previousContext, next_context: nextContext, tag, personalities }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with code ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let streaming = true;
      while (streaming) {
        const { value, done } = await reader.read();
        if (done) {
          onDone && onDone();
          break;
        }

        const text = decoder.decode(value);
        text.split("\n\n").forEach((msg) => {
          if (msg.length > 0) {
            msg = msg.replace(/^data: /, "");
            const message = JSON.parse(msg);
            onMessage(message);
          }
        });
      }
    } catch (error) {
      onError(`Request failed: ${error}`);
    }
  },
  getAllResources: async () => {
    try {
      const response = await fetch(`${BASE_URL}/resources/all`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "fuck ngrok",
          "Content-Type": "application/json",
        },
      });
      const text = await response.text();
      const data = JSON.parse(text);
      if (!response.ok) {
        throw new Error(`Request failed with code ${response.status}`);
      }
      // const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all resources:',error);
      throw error;
    }
  },
  getAllTemplates: async () => {
    try {
      const response = await fetch(`${BASE_URL}/templates/all`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "fuck ngrok",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Request failed with code ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all templates:',error);
      throw error;
    }
  },
  getAllNovels: async () => {
    try {
      const response = await fetch(`${BASE_URL}/novels/all`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "fuck ngrok",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Request failed with code ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all novels:',error);
      throw error;
    }
  },
  // Update Collect for a given novel_id
  updateCollect: async (novelId) => {
    try {
    const response = await fetch(`${BASE_URL}/novels/${novelId}/collect`, {
      method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "fuck ngrok",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Request failed with code ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all novels:',error);
      throw error;
    }
  },
  // Delete novel
  deleteNovel: async (novelId) => {
    try {
      const url = `${BASE_URL}/novels/${novelId}/delete`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with code ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting novel:', error);
      throw error;
    }
  },
  // Get template outline
  getOutline: async (templateId) => {
    try {
      const response = await fetch(`${BASE_URL}/templates/${templateId}`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "fuck ngrok",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Request failed with code ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all templates:',error);
      throw error;
    }
  },
  // get novel with novel_id
  getProject: async (novelId) => {
    try {
      const response = await fetch(`${BASE_URL}/novels/${novelId}`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "fuck ngrok",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Request failed with code ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all templates:',error);
      throw error;
    }
  },
};

// for testing
async function fetchImageAsFile(imageUrl, fileName) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
}

const runApiTests = async () => {
    try {
      // // Test getContextMessage
      // const contextMessage = await api.getContextMessage();
      // console.log('getContextMessage:', contextMessage);
  
      // // Test updateText
      // const contextId = '12345';
      // const updateTextResult = await api.updateText(contextId, 'Updated text content');
      // console.log('updateText:', updateTextResult);
      
      // // Test processShortText
      // const processShortTextResult = await api.processShortText(contextId);
      // console.log('processShortText:', processShortTextResult);
  
      // // Test startProcessing
      // const startProcessingResult = await api.startProcessing(contextId);
      // console.log('startProcessing:', startProcessingResult);
  
      // // Test getProcessStatus
      // const processStatusResult = await api.getProcessStatus(contextId);
      // console.log('getProcessStatus:', processStatusResult);
  
      // // Test detectCharacters
      // const textToDetectCharacters = 'This is a sample text with characters to detect.';
      // const detectCharactersResult = await api.detectCharacters(textToDetectCharacters);
      // console.log('detectCharacters:', detectCharactersResult);
  
      // // Test generateDescription
      // const imageUrl = "http://localhost:3001/test.png";
      // const file = await fetchImageAsFile(imageUrl, "test-image.jpg");
      // console.log(typeof file);
      // const generateDescriptionResult = await api.generateDescription(file, 'previous context', 'next context', 'tag', 'personalities');
      // console.log('generateDescription:', generateDescriptionResult);
  
      // Test generateDescriptionStream
      // const imageUrl = "http://localhost:3002/test.png";
      // const file = await fetchImageAsFile(imageUrl, "test-image.jpg");
      // console.log(typeof file);
      // await api.generateDescriptionStream(file, 'previous context', 'next context', 'tag', '', (message) => {
      //   console.log(`message: ${JSON.stringify(message)}`);
      // }, (err) => {console.log(`error: ${err}`);}, () => {console.log('done')});
  
      // await api.generateDescriptionStream(file, 'previous context', 'next context', 'tag', 'personalities', onMessage, onError, onDone);
  
      // // Test polishText
      // const polishTextResult = await api.polishText('Text to polish', 'previous context', 'next context', 'tag', 'personalities');
      // console.log('polishText:', polishTextResult);
  
      // Test polishTextStream
      // await api.polishTextStream('Sean长得很帅', 'previous context', 'next context', 'tag', '', (message) => {
      //   console.log(`message: ${JSON.stringify(message)}`);
      // }, (err) => {console.log(`error: ${err}`);}, () => {console.log('done')});
      // const allResources = await api.getAllResources();
      // console.log('allResources:', allResources);
      
    } catch (error) {
      console.error('API test error:', error);
    }
  };
  
// runApiTests();
export default api;