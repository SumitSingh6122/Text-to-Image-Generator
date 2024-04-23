import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import download from '../image/home.webp';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ImageGenerator = () => {
    const [imageUrl, setImageUrl] = useState("/");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const sizeRef = useRef(null);
    const [isDownload, setIsDownload] = useState(false);
    const { transcript } = useSpeechRecognition();
    const [values, setValues] = useState("");
    const [selectServer, setSelectServer] = useState();

    useEffect(() => {
        setValues(transcript);
    }, [transcript]);

    const generateImage = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!inputRef.current.value) {
                throw new Error("Please enter a prompt.");
            }

            let response,data,imageUrl;
            const size = sizeRef.current.value;
            if (selectServer === "server 2") {
                response = await fetch(
                    "https://api.openai.com/v1/images/generations",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer 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",
                            "User-Agent": "chrome",
                        },
                        body: JSON.stringify({
                            prompt: inputRef.current.value,
                            n: 1,
                            size: size,
                        }),
                    }
                );
                 data = await response.json();
             imageUrl = data.data[0].url;
            } else if (selectServer === "server 1") {
             response = await fetch(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer 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",
                    },
                    body: JSON.stringify({
                        inputs: inputRef.current.value || values,
                        size: size,
                    }),
                }
            );
             data = await response.blob();
             imageUrl = URL.createObjectURL(data)
            }

            if (!response.ok) {
                throw new Error("Failed to generate image. Please try again later.");
            }

         
            console.log(data);
           
            setImageUrl(imageUrl);
            setIsDownload(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.setAttribute('download', 'generated_image.jpg');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const voicetotext = () => {
        SpeechRecognition.startListening();
    };

    const handleChanges = (e) => {
        setValues(e.target.value);
    };

    const handleServerSelection = (server) => {
        setSelectServer(server);
    };

    return (
        <div className='container'>
            <div className="heading"><h2>AI Image <span>Generator</span></h2></div>
            <input type="checkbox" id="toggle" className="toggleCheckbox" />
            <label htmlFor="toggle" className="toggleContainerr">
                <div onClick={() => handleServerSelection("server 1")}>Server 1</div>
                <div onClick={() => handleServerSelection("server 2")}>Server 2</div>
            </label>
            <div className="generate-image">
                {isLoading ? (
                    <div className="loader"></div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    <img src={imageUrl === "/" ? download : imageUrl} alt="" />
                )}
            </div>
            <div className="separation"></div>
            <div className="dowload">
                {isDownload && (
                    <button type="button" className='dowloadBtn' onClick={downloadImage}><i className='bx bxs-download'></i>DOWNLOAD</button>
                )}
            </div>
            <div className="command">
                <input type='text' className='search-input' ref={inputRef} value={values} placeholder='Enter your prompt' onChange={handleChanges} />
                <div id='mic' onClick={voicetotext}><i className='bx bx-microphone voice'></i></div>
                <button className='btn' onClick={generateImage}>Generate</button>
            </div>
            <div className="box"><span>Enter the size :</span>
                <input type='text' className='search-input' ref={sizeRef} placeholder='512x512' value={"512x512"} />
            </div>
            <div className="sec_box"><span>Number of photo :</span>
                <input type='text' placeholder='Enter here' value={1} />
            </div>
        </div>
    );
}

export default ImageGenerator;
