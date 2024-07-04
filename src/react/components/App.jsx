import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Chat from './Chat';
import { useAppContext } from '../context/AppContext';

const App = () => {
  const appContext = useAppContext();
  const { getProblemInfo, title, description, code, language } = appContext;

  useEffect(() => {
    getProblemInfo();
  }, []);

  return (
    <div className='w-[500px] h-[600px] bg-base-100'>
      <Header/>
      <div className='pt-20 px-5 pb-16'>
        <Chat/>
      </div>
      <Footer/>
    </div>
  );
};
export default App;