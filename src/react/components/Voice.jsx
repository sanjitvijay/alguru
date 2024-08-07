import {useVoiceChatContext} from "../context/VoiceChatContext.jsx";
import InfoCard from "./InfoCard.jsx";
import { FaRegLightbulb } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa6";
import { FaBug } from "react-icons/fa";
import {Mic} from "lucide-react";
import speech, {useSpeechRecognition} from "react-speech-recognition";
import {CircleStop} from "lucide-react";
import {useAppContext} from "../context/AppContext.jsx";


function Voice() {
    const {audio, onStartListening, onStopListening, thinking, responseText, setResponseText} = useVoiceChatContext();
    const {isVoiceAvailable} = useAppContext();
    const {listening, transcript} = useSpeechRecognition();

    const onAudioEnded = () => {
        setResponseText('');
        if(isVoiceAvailable){
            onStartListening()
        }
        else{
            speech.resetTranscript();
        }
    }
    return (
        <div>
            {audio && <audio src={audio} autoPlay onEnded={onAudioEnded}/>}
            <div className='text-center mb-5'>
                <div className='text-2xl font-bold'>Talk to Alguru</div>
                <div className='text-lg'>Your AI-generated coding interview coach</div>


                <button className="btn btn-xs mb-5" onClick={() => document.getElementById('help_modal').showModal()}>
                    How to enable?
                </button>

                <dialog id="help_modal" className="modal">
                    <div className="modal-box w-80">
                        <h3 className="font-bold text-lg">Using Alguru Voice Mode</h3>
                        <p className="py-4">Enable microphone in Extension permissions</p>
                        <ul className='list-disc text-left'>
                            <li>Right-click on extension icon in taskbar</li>
                            <li>Click "View Web Permissions"</li>
                            <li>Confirm Microphone is set to Allow (not Ask)</li>
                        </ul>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                <div className='flex items-center justify-between'>
                    <InfoCard icon={<FaQuestion size={20} color={'#ec4899'}/>}
                              text={'Simulate a real coding interview'}/>
                    <InfoCard icon={<FaBug size={20} color={'#ef4444'}/>} text={'Get debugging help'}/>
                    <InfoCard icon={<FaRegLightbulb size={20} color={'#f59e0b'}/>} text={'Ask for hints'}/>
                </div>
            </div>


            {isVoiceAvailable && <div className='flex justify-center items-center'>
                <div
                    className="h-10 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 z-10 cursor-pointer border-base-content border-2 hover:p-[2px] hover:border-0"
                    onClick={onStartListening}
                >
                    <div
                        className="bg-base-100 text-center w-full h-full rounded-full flex justify-center items-center px-2">
                            <Mic className="w-5 h-5 mr-2"/>
                            <div>Start Listening</div>
                        </div>
                    </div>
                    <div>
                        {listening &&
                            <CircleStop
                                className="w-8 h-8 ml-2 text-error hover:w-9 hover:h-9" strokeWidth={1.5}
                                onClick={onStopListening}
                            />
                        }
                    </div>
            </div>}


            <div className='flex justify-center items-end mt-16 h-10'>
                {listening &&
                    <>
                        <div className='text-xl font-bold mr-1'>
                            Listening
                        </div>
                        <div className="loading loading-dots loading-sm"></div>
                    </>
                }

                {thinking &&
                    <>
                        <div className='text-xl font-bold mr-1'>
                            Thinking
                        </div>
                        <div className="loading loading-dots loading-sm"></div>
                    </>
                }
            </div>

            <div className='prose'>
                {transcript && <div className='text-md mb-2'>You: {transcript}</div>}
                {(responseText && !thinking) && <div className='text-md'>Alguru: {responseText}</div>}
            </div>
        </div>

    );
}

export default Voice;