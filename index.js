const generateForm = document.querySelector('.form-generator');
const imageGallery = document.querySelector('.img-gallery');
let isImageGenerating = false;


const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];

    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");


    const aiGeneratedImg = `data:image/jpeg:based64,${imgObject.b64_json}`;

    imgElement.src = aiGeneratedImg;

    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImg);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    };
  });
};

const generateAiImages = (userPrompt, userImgQuantity) => {
  //send request to open ai api to generate images based on inputs
  try{
    const response = await fetch ("https://api.openai.com/v1/images/generations", 
    {
      method: "POST",
      headers: {
        "Content-Type": "applicatio.json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: userPrompt,
        n: parseInt( userImgQuantity),
        size: "512 * 512",
        response_format: "b64_json"
      });
    });

    if(!response.ok) throw new Error ("Failed to generate image! Please try again.");

    const { data } = await response.json(); //get data from response
    updateImageCard([...data]);
  } catch (error) {
    alert(error.message)
  } finally{
    isImageGenerating = false;
  }
};


const handleFormSubmission = (e) => {
 e.preventDefault();
 if(isImageGenerating) return;
 isImageGenerating = true;

//Get user input and image quantity value from form
 const userPrompt = e.srcElement[0].value;
 const userImgQuantity = e.srcElement[1].value;

const imgCardMarkup = Array.from({length: userImgQuantity}, () => 

` <div class="img-card loading">
<img src="images/loader.svg" alt="image">
<a href="#" class="download-btn">
  <img src="images/download.svg" alt="download icon">
</a>
</div>
`).join("");


imageGallery.innerHTML = imgCardMarkup;

generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);