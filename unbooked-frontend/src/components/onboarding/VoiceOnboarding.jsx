import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from "@11labs/react";
import './VoiceOnboarding.css';

const VoiceOnboarding = ({ onProfileUpdate }) => {
    // Session state
    const [hasPermission, setHasPermission] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Extracted profile data
    const [extractedProfile, setExtractedProfile] = useState({});

    // Conversation history
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi, I'm Nova, your onboarding assistant. I'll help set up your business profile. Tell me about your business - what services you offer, your hours, and location."
        }
    ]);

    // Refs
    const messagesEndRef = useRef(null);

    // Initialize ElevenLabs conversation hook
    const conversation = useConversation({
        onConnect: () => {
            console.log("Connected to ElevenLabs");
            setErrorMessage('');
        },
        onDisconnect: () => {
            console.log("Disconnected from ElevenLabs");
        },
        onMessage: (message) => {
            console.log("Received message:", message);

            // Add the AI's message to the conversation
            if (message.text) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: message.text
                }]);
            }

            // Process extracted fields if available
            if (message.fields) {
                updateExtractedProfile(message.fields);
            }
        },
        onError: (error) => {
            const errorMsg = typeof error === "string" ? error : error.message;
            setErrorMessage(errorMsg);
            console.error("Error:", error);
        },
    });

    const { status, isSpeaking } = conversation;

    // Request microphone permission
    useEffect(() => {
        const requestMicPermission = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                setHasPermission(true);
            } catch (error) {
                setErrorMessage("Microphone access denied");
                console.error("Error accessing microphone:", error);
            }
        };

        requestMicPermission();
    }, []);

    // Auto-scroll messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Update extracted profile data
    const updateExtractedProfile = (fields) => {
        setExtractedProfile(prev => ({
            ...prev,
            ...fields
        }));

        // Pass updated profile to parent component
        if (onProfileUpdate) {
            onProfileUpdate({
                ...extractedProfile,
                ...fields
            });
        }
    };

    // Start a conversation with ElevenLabs
    const startConversation = async () => {
        try {
            setIsProcessing(true);
            setErrorMessage('');

            // Hard-coded agent ID to prevent undefined in production
            const AGENT_ID = process.env.REACT_APP_ELEVENLABS_AGENT_ID || "Mfm7TRlJAk6BUoT4JPn3";

            const conversationId = await conversation.startSession({
                agentId: AGENT_ID,
            });

            console.log("Started conversation:", conversationId);

            // Add user's initial message to conversation log
            setMessages(prev => [...prev, {
                role: 'user',
                content: "I'd like to set up my business profile"
            }]);

        } catch (error) {
            console.error("Error starting conversation:", error);
            setErrorMessage("Failed to start conversation: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // End the conversation
    const endConversation = async () => {
        try {
            await conversation.endSession();
        } catch (error) {
            console.error("Error ending conversation:", error);
            setErrorMessage("Failed to end conversation");
        }
    };

    // Toggle mute for audio
    const toggleMute = async () => {
        try {
            await conversation.setVolume({ volume: isMuted ? 1 : 0 });
            setIsMuted(!isMuted);
        } catch (error) {
            setErrorMessage("Failed to change volume");
            console.error("Error changing volume:", error);
        }
    };

    // Calculate status text and CSS class
    const getStatusText = () => {
        if (errorMessage) return errorMessage;
        if (isProcessing) return 'Processing...';
        if (status === 'connected') {
            return isSpeaking ? 'Nova is speaking...' : 'Listening...';
        }
        return 'Start conversation';
    };

    const getStatusClass = () => {
        if (errorMessage) return 'error';
        if (isProcessing) return 'processing';
        if (status === 'connected') {
            return isSpeaking ? 'speaking' : 'recording';
        }
        return 'idle';
    };

    return (
        <div className="voice-onboarding">
            <div className={`connection-status ${getStatusClass()}`}>
                {getStatusText()}
            </div>

            <div className="conversation-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role === 'assistant' ? 'nova' : 'user'}`}>
                        <div className="message-avatar">
                            {msg.role === 'assistant' ? 'N' : 'Y'}
                        </div>
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {Object.keys(extractedProfile).length > 0 && (
                <div className="extracted-data">
                    <h3>Profile Information</h3>
                    <div className="data-preview">
                        {Object.entries(extractedProfile).map(([key, value]) => (
                            <div key={key} className="data-item">
                                <div className="label">{key.replace(/_/g, ' ')}</div>
                                <div className="value">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="voice-controls">
                {status === 'connected' ? (
                    <div className="active-controls">
                        <button
                            className="end-button"
                            onClick={endConversation}
                        >
                            End Conversation
                        </button>
                        <button
                            className={`mute-button ${isMuted ? 'muted' : ''}`}
                            onClick={toggleMute}
                        >
                            {isMuted ? 'Unmute' : 'Mute'}
                        </button>
                    </div>
                ) : (
                    <button
                        className="start-button"
                        onClick={startConversation}
                        disabled={isProcessing || !hasPermission}
                    >
                        {!hasPermission ? 'Microphone Access Needed' :
                            isProcessing ? 'Connecting...' : 'Start Conversation'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default VoiceOnboarding; 