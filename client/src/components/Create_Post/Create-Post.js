import React, { useState, useEffect, useContext } from 'react';
import { styled, Box, TextareaAutosize, Button, InputBase, FormControl } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cleanStatus, savePost } from '../Redux/features/CreatePostRedux';
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

const initialPost = {
    title: '',
    description: '',
    picture: '',
    username: '',
    categories: '',
    createdDate: new Date()
};

const CreatePost = () => {
    const { logindata } = useContext(LoginContext);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [post, setPost] = useState(initialPost);
    const [file, setFile] = useState(null);

    const url = file ? URL.createObjectURL(file) : 'https://via.placeholder.com/800x400'; // Default image URL
    
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

    const savePosts = async () => {
        const { title, description, categories } = post;
        const username = logindata?.ValidUserOne?.fname;

        if (title && description && file && username) {
            dispatch(savePost({ title, description, categories, image: file, username }));
            setPost(initialPost); // Reset form fields
            setFile(null); // Reset file
        }
    };
    const status = useSelector((state)=>state.data.status)
    console.log('status',status)


    useEffect(() => {
        if (status === "fulfilled") { 
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
                <Button variant="contained" onClick={savePosts} color="primary">
                    Publish
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

export default CreatePost;
