
import React, { useState, useEffect, useContext } from 'react';
import { styled, Box, TextareaAutosize, Button, InputBase, FormControl } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cleanStatus, deletePost, getData, savePost, updatePost } from '../Redux/features/CreatePostRedux';
import { LoginContext } from '../ContextProvider/Context';


const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    }
}));

const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
`;

const InputTextField = styled(InputBase)`
    flex: 1;
    margin: 0 30px;
    font-size: 25px;
`;

const Textarea = styled(TextareaAutosize)`
    width: 100%;
    border: none;
    margin-top: 50px;
    font-size: 18px;
    &:focus-visible {
        outline: none;
    }
`;



const UpdatePost = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate()
    const viewData = useSelector(getData);
    console.log("viewData", viewData);
    const [post, setPost] = useState({ ...viewData });
    const [file, setFile] = useState(null);

    const imageUrl = viewData ? `http://localhost:8009/images/${post.imageUrl}` : 'http://default-url.com';

    // Assuming file is a Blob or File object
    const url = file ? URL.createObjectURL(file) : imageUrl;    
    useEffect(() => {
        post.categories = location.search?.split('=')[1] || 'All';
    }, [location.search, post]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const UpdatePost = async () => {
        dispatch(updatePost({ id: post._id ,newData:post,}))

    };

    
    const deletePosts = async () => {
        dispatch(deletePost({ id: post._id }))
         
    };

    const status = useSelector((state)=>state.data.status)

    useEffect(() => {
        if (status === "deleted") { 
         navigate('/dash')
         dispatch(cleanStatus());
        } 
        else if(status === "updated"){
            navigate('/dash')
         dispatch(cleanStatus());
        }

      }, [status]);

   

    return (
        <Container>
            <Image src={url} alt="post" />

            <StyledFormControl>
                <label htmlFor="fileInput">
                    <Add fontSize="large" color="action" />
                </label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <InputTextField name='title' value={post.title} onChange={handleChange} placeholder="Title" />
                <Button variant="contained" onClick={UpdatePost} color="primary">
                    Publish
                </Button>
                <Button variant="contained" onClick={deletePosts} color="primary">
                    deletePost
                </Button>
            </StyledFormControl>

            <Textarea
                rowsMin={5}
                name='description'
                value={post.description}
                onChange={handleChange}
                placeholder="Tell your story..."
            />
        </Container>
    );
};

export default UpdatePost;
