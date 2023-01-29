# ZAP-GPT

### Clone the project
Clone this project with the code below:

```bash
$ git clone https://github.com/VictorMonteiro7/zap-gpt.git
```
--- 

### What do you will need?

> Open-AI API Key
- Click on [this link](https://beta.openai.com/account/api-keys), and click in `Create new secret key` button  

> Organization ID (Open-AI)
- Click on [this link](https://beta.openai.com/account/org-settings), select your organization and get the Organization ID.

> Tenor API Key  
- Follow the instructions to generate a [TENOR API KEY here](https://developers.google.com/tenor/guides/quickstart)

Copy the `env.local` file to the root folder, and rename it to `.env`.

```bash
$ cp <PATH>/.env.local .env 
```
After this, put the KEY, Organization ID, your tel number and the TENOR API KEY on the variables. 

---  
### How to run the project?

First of all, make a `npm install` to install all the dependencies. 

```bash
$ cd <PATH> && npm install
```
After this, run the project with `npm start`

```bash
$ npm start
```
---

### Features

- **/chatbot \<text\>**
  - Use the above command to ask something, and the bot will return a reply. E.g.:
    > */chatbot How do I make a cake?*
- **/imgbot \<description\>**
  - Use the above command to generate a DALL-E image. E.g.:
    > */imgbot generate a cake image*
- **/stickerbot**
  - The above command work in two ways:
    - With a image in whatsapp and with only the command as a description. E.g.: 
    > (image)  
    > */stickerbot*
  - With a URL. E.g.:
    > */stickerbot https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pound_layer_cake.jpg/800px-Pound_layer_cake.jpg*
  - With key words. E.g.:
    > */stickerbot choco cake*
- **/imgvarbot**
  - The above command works like the _/stickerbot_ command, and will generate a new variant of the image. E.g (w/ url): 
    > */imgvarbot https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pound_layer_cake.jpg/800px-Pound_layer_cake.jpg*

---

# DO NOT USE THIS BOT TO ASK WRONG THINGS!

You can check the origin guide into this link
[Origin guide](https://www.tabnews.com.br/victorharry/guia-completo-de-como-integrar-o-chat-gpt-com-whatsapp)
