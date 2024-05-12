import React, { useContext, useEffect ,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/Context';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Banner from './Banner';
import Categories from './Categories';
import { Grid } from '@mui/material';
import axios from 'axios';
import Post from './Create_Post/Post';
const Dashboard = () => {

    const { logindata, setLoginData } = useContext(LoginContext);

    const [data, setData] = useState(false);


    const history = useNavigate();

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");

        const res = await fetch("/validuser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await res.json();

        if (data.status == 401 || !data) {
            history("*");
        } else {
            console.log("user verify");
            setLoginData(data)
            history("/dash");
        }
    }


    useEffect(() => {
        setTimeout(() => {
            DashboardValid();
            setData(true)
        }, 2000)

    }, [])

  
    
    return (
        <>
            {
                data ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img src="./man.png" style={{ width: "200px", marginTop: 20 }} alt="" />
                    <h1>User Email:{logindata ? logindata.ValidUserOne.email : "" }</h1>
                    <h1>UserName:{logindata ? logindata.ValidUserOne.fname : "" }</h1>

                    {logindata? <Banner/> : ""}
                    {logindata? <Grid container><Grid item lg={2} xs={12} sm={2}>   <Categories  logindata={logindata}/> </Grid>  <Grid container item xs={12} sm={10} lg={10}><h1><Post/></h1> 
                   
      </Grid> </Grid> :""}
                </div> : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    Loading... &nbsp;
                    <CircularProgress />

                </Box>
            }

        </>

    )
}

export default Dashboard