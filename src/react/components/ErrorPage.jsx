function ErrorPage() {
    return (
        <div className='text-center prose'>
            <h3 className='mb-4'>Error Loading Problem Information</h3>
            <p>Open a Problem in <a href='https://leetcode.com/problemset/' target='_blank' className='underline text-pink-500 hover:text-orange-500 visited:text-yellow-500 '>Leetcode</a> to use this extension</p>
        </div>
    );
}

export default ErrorPage;