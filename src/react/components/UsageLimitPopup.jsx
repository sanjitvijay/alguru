import React from 'react';
import logo from '../assets/logo.png';

function UsageLimitPopup() {
    return (
        <div className='text-center'>
            <img src={logo} alt="logo" className="h-10 w-10 mx-auto"/>
            <h3 className="font-bold text-lg">Usage Limit Reached</h3>
            <p className="py-4">Because this extension is powered by multiple AI models which cost money, usage limits are required to keep this extension free</p>
            <p className="py-4">If you enjoy using this app, please consider donating at <a href='https://buymeacoffee.com/sanjitvijay' target='_blank' className='underline text-pink-500 hover:text-orange-500 visited:text-yellow-500'>Buy Me A Coffee</a> to help support development and keep this extension free for everyone. Thank you!
            </p>
        </div>
    );
}

export default UsageLimitPopup;