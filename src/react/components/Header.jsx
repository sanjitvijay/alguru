import logo from '../assets/logo.png';
function Header() {
  return (

    <div class="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 pb-[2px] z-10 fixed">
        <div class="flex h-10 w-full items-center justify-between bg-base-100 back py-8 px-3">
            <div className='flex items-center'>
                <img src={logo} alt="logo" class="h-10 w-10 mr-3"/>
                <div className="text-3xl text-white font-bold">LeetCodeAI</div>
            </div>
            <div></div>
        </div>
    </div>
  )
}

export default Header;
