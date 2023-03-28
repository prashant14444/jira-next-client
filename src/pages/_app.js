import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';

import createEmotionCache from '../utility/createEmotionCache';
import lightTheme from '../styles/theme/lightTheme';

//commented out this line becauseit was showing multiple divs on every page
// import '../styles/globals.css';
import Navbar from '../components/navbar.js'
import NextNProgress from 'nextjs-progressbar';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useRouter } from 'next/router';

const clientSideEmotionCache = createEmotionCache();


const MyApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [token, setToken] = useState('');
  
  const router = useRouter();
  const showHeader = router.pathname === '/login' ? false : true;
  
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  });

  return (
    <CacheProvider value={emotionCache}>
      <NextNProgress />
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Container maxWidth="l" sx={{marginTop:"10px"}}>
          <Box>
            {showHeader ?
            <>
              <Navbar token={token} >
                <Component {...pageProps} token={token}/>
              </Navbar>
            </> : <Component {...pageProps} token={token}/>}
          </Box>
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};