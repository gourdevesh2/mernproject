import React, { useContext, useEffect, useState } from 'react';
import { styled, Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData, updatePost, updatetPostById } from '../Redux/features/CreatePostRedux';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
const Container = styled(Box)`
    border: 1px solid #d3cede;
    border-radius: 10px;
    margin: 10px;
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 350px;
    padding: 10px;
`;

const Image = styled('img')({
    width: '100%',
    objectFit: 'cover',
    borderRadius: '10px 10px 0 0',
    height: 150
});

const Text = styled(Typography)`
    color: #878787;
    font-size: 12px;
`;

const Heading = styled(Typography)`
    font-size: 18px;
    font-weight: 600;
`;

const Details = styled(Typography)`
    font-size: 14px;
    word-break: break-word;
`;

const Post = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { logindata } = useContext(LoginContext);

    const { loading, error, data } = useSelector((state) => state.data);
  

    useEffect(() => {
        // Dispatch the fetchData async thunk when the component mounts
        dispatch(fetchData());
    }, [dispatch]);

   
   
    console.log('valid',logindata.ValidUserOne.fname)

    const addEllipsis = (str, limit) => {
        return str.length > limit ? str.substring(0, limit) + '...' : str;
    };

    const renderPostContainers = () => {
        if (!data) {
            return <div>Loading...</div>;
        }
    
        const handlePostClick = (postId,username) => {
       if(logindata.ValidUserOne.fname == username )

        {
            dispatch(updatetPostById({ postId:postId, updatedData: { /* Specify updated fields */ } }));
            navigate('/updatepost');  
        }
        else{
           alert("Not a Valid User")

        }  
            };

        const rows = [];
        const maxColumns = 4;
        let currentRow = [];

        data.forEach(post => {
            currentRow.push(
                <Container key={post._id}   onClick={() => handlePostClick(post._id, post.username)} >
                    <Image
                        src={`http://localhost:8009/images/${post.imageUrl}`}
                        alt="post"
                        style={{ width: '100%', height: '190px', objectFit: 'cover' }}
                    />
                    <Heading>Title:{addEllipsis (post.title, 20)}</Heading>
                    <Text>Author: {post.username}</Text>
                    <Details> Categories:{addEllipsis(post.categories, 100)}</Details>
                    <Details> description:{addEllipsis(post.description, 100)}</Details>
                    
                </Container>
            );

            // Check if currentRow has reached the maxColumns limit
            if (currentRow.length === maxColumns) {
                rows.push(<div style={{ display: 'flex', flexDirection: 'row' }}>{currentRow}</div>);
                currentRow = []; // Reset the currentRow
            }
        });

        // If there are remaining containers in currentRow, push them to rows
        if (currentRow.length > 0) {
            rows.push(<div style={{ display: 'flex', flexDirection: 'row' }}>{currentRow}</div>);
        }

        return rows;
    };

    return <div>{renderPostContainers()}</div>;
};

export default Post;
