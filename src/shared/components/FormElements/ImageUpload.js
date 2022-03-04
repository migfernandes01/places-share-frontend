import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';  //Button component

import './ImageUpload.css';     //CSS files

function ImageUpload(props) {
    //file state
    const [file, setFile] = useState();
    //previewUrl state
    const [previewUrl, setPreviewUrl] = useState();
    //isValid state
    const [isValid, setIsValid] = useState(false);

    //ref to file picker input 
    const filePickerRef = useRef();

    //function to execute when file changes
    useEffect(() => {
        //if there is no file
        if(!file){
            return;
        }
        //new FileReader object(from vanilla JS)
        const fileReader = new FileReader();
        //when filereader is done parsing a file, execute anonymous function
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        //read file as URL
        fileReader.readAsDataURL(file);
    }, [file]);

    //function to handle image pickage
    const pickedHandler = (event) => {
        let pickedFile;
        let fileIsValid = isValid;
        //if there are files in the event object
        if(event.target.files && event.target.files.length === 1){
            //get file (first one only)
            pickedFile = event.target.files[0];
            //set file to the picked file
            setFile(pickedFile);
            //set isValid to true
            setIsValid(true);
            fileIsValid = true;
        }else{  //if there are no files in event
            //set isValid to false
            setIsValid(false);
            fileIsValid = false;
        }
        //call function from props
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    //function that handles the click on button to add image
    const pickImageHandler = () => {
        //open file picker
        filePickerRef.current.click();
    };

    return (
        <div className='form-control'>
            <input 
                type='file' 
                id={props.id} 
                style={{ display: 'none' }} 
                accept='.jpg,.png,.jpeg' 
                ref={filePickerRef}
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick an image</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p className='error-message'>{props.errorText}</p>}
        </div>
    );
}

export default ImageUpload;