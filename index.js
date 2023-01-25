import { create } from 'venom-bot'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import axios from 'axios';

dotenv.config();

const configuration = new Configuration({
  organization: process.env.CHATGPT_ORGANIZATION_ID,
  apiKey: process.env.CHATGPT_API_KEY,
});

const openai = new OpenAIApi(configuration);

create({
    session: 'chat-gpt',
    multidevice: true
})
  .then((client) => start(client))
  .catch((erro) => {
      console.log(erro)
  })

const getDavinciResponse = async (clientText) => {
  const options = {
    model: "text-davinci-003", // Modelo GPT a ser usado
    prompt: clientText, // Texto enviado pelo usuário
    temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
    max_tokens: 4000 // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
  }

  try {
    const response = await openai.createCompletion(options)
    let botResponse = ""
    response.data.choices.forEach(({ text }) => {
        botResponse += text
    })
    return `${botResponse.trim()}`
  } catch (e) {
    return `❌ OpenAI Response Error: ${e.response?.data?.error?.message}`
  }
}

const getDalleResponse = async (clientText, sizeImg) => {
  const options = {
    prompt: clientText, // Descrição da imagem
    n: 1, // Número de imagens a serem geradas
    size: sizeImg ?? "1024x1024", // Tamanho da imagem
  }

  try {
    const response = await openai.createImage(options);
    return response.data?.data[0]?.url;
  } catch (e) {
    return `❌ OpenAI Response Error: ${e.response?.data?.error?.message}`
  }
}

const commands = async (client, message) => {
  const iaCommands = {
    davinci3: "/chatbot",
    dalle: "/imgbot",
    sticker: "/stickerbot",
  }

  let firstWord = message.type === 'image' || message.type === 'video' ? message.text : message.text?.substring(0, message.text.indexOf(" "));

  const messageTo = message.from === process.env.PHONE_NUMBER ? message.to : message.from;
  switch (firstWord?.trim().toLowerCase()) {
    case iaCommands.davinci3:
      client.sendText(messageTo, 'Aguarde uns instantes...\nEstamos gerando o texto....' );
      const question = message.text.substring(message.text.indexOf(" "));
      getDavinciResponse(question).then((response) => {
        client.sendText(messageTo, response)
          .then((r)=> {
            // silently ignore
          })
          .catch((e) => {
            client.sendText(messageTo, '❌ Ocorreu um problema ao gerar a sua solicitação. Por favor, tente novamente.');
          });
      }).catch((e) => {
        // silently ignore
      });
      break;
    case iaCommands.dalle:
      client.sendText(messageTo, 'Aguarde uns instantes...\nEstamos gerando a imagem....' );
      let imgDescription = message.text.substring(message.text.indexOf(" "));
      const regexToGetSize = /\d{3,4}x\d{3,4}/g;
      let sizeImg = imgDescription.match(regexToGetSize)?.[0];
      const allowedSizes = ["256x256", "512x512", "1024x1024"];
      if (allowedSizes.includes(sizeImg)) {
        sizeImg = sizeImg;
      } else {
        client.sendText(messageTo, '❗O tamanho da imagem não é permitido, e trocamos para o tamanho padrão de 1024x1024.');
        sizeImg = "1024x1024";
      }
      imgDescription = imgDescription.replace(sizeImg, '').trim();
      getDalleResponse(imgDescription, sizeImg).then((imgUrl) => {
        client.sendImage(
          messageTo,
          imgUrl,
          imgDescription,
          `Imagem gerada pela IA DALL-E 🤖\n\nSolicitado por: ${message.sender?.pushname}\n\nTexto da descrição: ${imgDescription}`
        ).then((r) => {
          // silently ignore
        })
        .catch((e) => {
          console.log(e);
          client.sendText(messageTo, '❌ Sua solicitação foi rejeitada, por conta de palavras impróprias ou ofensivas.')
        });
      }).catch((e) => {
        // silently ignore
      });
      break;
    case iaCommands.sticker:
      client.sendText(messageTo, 'Aguarde uns instantes...\nEstamos gerando o sticker....' );
      if (message.type === 'image') {
        const stickerBase64 = message.mediaData.preview._b64;
        const base64 = `data:${message.mediaData.mimetype};base64,${stickerBase64}`;
        client.sendImageAsSticker(messageTo, base64);
      } else if (message.type === 'video') {
        const videoBase64 = message.mediaData.preview._b64;
        client.sendImageAsStickerGif(messageTo, videoBase64)
          .then((response) => {
            if (!response) {
              client.sendText(messageTo, '❌ Erro ao gerar o sticker, no momento só é possível gerar stickers de imagens');
            }
          })
          .catch((e) => {
            client.sendText(messageTo, '❌ Erro ao gerar o sticker, verifique se o link está correto.');
          });
      } else {
        const url = message.text.substring(message.text.indexOf(" "));
        try {
          const initWithData = /^data:/;
          if (initWithData.test(url)) {
            client.sendImageAsSticker(messageTo, url);
          } else {
            const { data } = await axios.get(url, {responseType: 'arraybuffer'});
            const base64 = Buffer.from(data).toString('base64');
            client.sendImageAsSticker(messageTo, base64)
            .then((response) => {
              // silently ignore
            })
            .catch((e) => {
              client.sendText(messageTo, '❌ Erro ao gerar o sticker, verifique se o link está correto.');
            });
          }
        } catch (e) {
          console.log('ERROR', e);
        }
      }
      break;
  }
}

async function start(client) {
  client.onAnyMessage((message) => commands(client, message));
}
