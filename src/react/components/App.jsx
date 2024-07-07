import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import SystemChat from './SystemChat';
import { useAppContext } from '../context/AppContext';

const App = () => {
  const {getProblemInfo, hint} = useAppContext();

  useEffect(() => {
    getProblemInfo();
  }, []);

  return (
    <div className='w-[500px] h-[600px] bg-base-100'>
      <Header/>
      <div className='pt-20 px-5 pb-16'>
        <SystemChat response={hint}/>
      </div>
      <Footer/>
    </div>
  );
};
export default App;