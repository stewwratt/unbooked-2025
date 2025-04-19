import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from "@11labs/react";
import './VoiceOnboarding.css';

const VoiceOnboarding = ({ onProfileUpdate }) => {
    // Conversation state
    const [hasPermission, setHasPermission] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [extractedProfile, setExtractedProfile] = useState(null);
    const [agentId, setAgentId] = useState(null);

    // UI state
    const [isProcessing, setIsProcessing] = useState(false);

    // Conversation history 
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi, I'm Nova, your onboarding assistant. I'll help set up your business profile. Tell me about your business - what services you offer, your hours, and location." }
    ]);

    // Ref for auto-scrolling
    const messagesEndRef = useRef(null);

    // Initialize ElevenLabs conversation hook
    const conversation = useConversation({
        onConnect: () => {
            console.log("Connected to ElevenLabs");
            setIsProcessing(false);
        },
        onDisconnect: () => {
            console.log("Disconnected from ElevenLabs");
        },
        onMessage: (message) => {
            console.log("Received message:", message);
            // Add the agent's response to our messages
            if (message.text) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: message.text
                }]);
            }

            // Process extracted fields if available
            if (message.fields || message.extracted_data) {
                const fields = message.fields || message.extracted_data || {};
                updateExtractedProfile(fields);
            }
        },
        onError: (error) => {
            const errorMsg = typeof error === "string" ? error : error.message;
            setErrorMessage(errorMsg);
            console.error("ElevenLabs Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${errorMsg}`
            }]);
            setIsProcessing(false);
        },
        onUserMediaStatusChange: ({ hasMic }) => {
            setHasPermission(hasMic);
        },
    });

    const { status, isSpeaking } = conversation;

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Request microphone permission on component mount
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

    // Fetch agent ID on component mount
    useEffect(() => {
        const fetchAgentId = async () => {
            try {
                // Use relative path in production
                const response = await fetch("/api/elevenlabs-agent-id");

                if (!response.ok) {
                    throw new Error(`Failed to fetch agent ID: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched agent ID successfully");
                setAgentId(data.agentId);
            } catch (error) {
                console.error("Error fetching agent ID:", error);
                setErrorMessage("Failed to fetch agent ID");
            }
        };

        fetchAgentId();
    }, []);

    // Update parent component when profile data changes
    useEffect(() => {
        if (extractedProfile) {
            onProfileUpdate(extractedProfile);
        }
    }, [extractedProfile, onProfileUpdate]);

    // Update extracted profile data from Nova's responses
    const updateExtractedProfile = (fields) => {
        setExtractedProfile(prev => {
            const updated = { ...prev, ...fields };
            return updated;
        });
    };

    // Start conversation with ElevenLabs agent
    const startConversation = async () => {
        try {
            setIsProcessing(true);
            setErrorMessage("");

            if (!agentId) {
                throw new Error("Missing ElevenLabs Agent ID - please try again in a moment");
            }

            // Start the session with ElevenLabs
            const conversationId = await conversation.startSession({
                agentId: agentId,
            });

            console.log("Started conversation:", conversationId);

            // Add user's first message
            const firstMessage = "Hi Nova, I'd like to set up my business profile";
            setMessages(prev => [...prev, {
                role: 'user',
                content: firstMessage
            }]);

        } catch (error) {
            setErrorMessage("Failed to start conversation");
            console.error("Error starting conversation:", error);
            setIsProcessing(false);
        }
    };

    // End the conversation
    const handleEndConversation = async () => {
        try {
            await conversation.endSession();
        } catch (error) {
            setErrorMessage("Failed to end conversation");
            console.error("Error ending conversation:", error);
        }
    };

    // Toggle mute status
    const toggleMute = async () => {
        try {
            await conversation.setVolume({ volume: isMuted ? 1 : 0 });
            setIsMuted(!isMuted);
        } catch (error) {
            setErrorMessage("Failed to change volume");
            console.error("Error changing volume:", error);
        }
    };

    // Get a status message based on current state
    const getStatusText = () => {
        if (errorMessage) return errorMessage;
        if (isProcessing) return "Connecting...";
        if (status === "connected") {
            return isSpeaking ? "Nova is speaking..." : "Listening for your voice...";
        }
        return "Ready to start";
    };

    // Get the CSS class for the status
    const getStatusClass = () => {
        if (errorMessage) return "error";
        if (isProcessing) return "processing";
        if (status === "connected") {
            return isSpeaking ? "speaking" : "recording";
        }
        return "idle";
    };

    // Render component
    return (
        <div className="voice-onboarding">
            <div className={`connection-status ${getStatusClass()}`}>
                {getStatusText()}
            </div>

            <div className="conversation-container">
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role === 'assistant' ? 'nova' : 'user'}`}>
                        <div className="message-avatar">
                            {msg.role === 'assistant' ? 'N' : 'Y'}
                        </div>
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {extractedProfile && Object.keys(extractedProfile).length > 0 && (
                <div className="extracted-data">
                    <h3>Extracted Profile Information</h3>
                    <div className="data-preview">
                        {Object.entries(extractedProfile).map(([key, value]) => (
                            <div key={key} className="data-item">
                                <div className="label">{key.replace(/_/g, ' ')}</div>
                                <div className="value">
                                    {typeof value === 'object'
                                        ? JSON.stringify(value)
                                        : String(value)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="voice-controls">
                {status !== "connected" ? (
                    <button
                        className="start-button"
                        onClick={startConversation}
                        disabled={isProcessing || !hasPermission || !agentId}
                    >
                        {isProcessing ? 'Connecting...' :
                            !agentId ? 'Loading agent...' : 'Start Conversation'}
                    </button>
                ) : (
                    <>
                        <button
                            className="end-button"
                            onClick={handleEndConversation}
                        >
                            End Conversation
                        </button>
                        <button
                            className={`volume-button ${isMuted ? 'muted' : ''}`}
                            onClick={toggleMute}
                        >
                            {isMuted ? 'Unmute' : 'Mute'}
                        </button>
                    </>
                )}
            </div>

            {!hasPermission && status !== "connected" && (
                <div className="mic-permission-error">
                    Microphone access is required. Please enable it in your browser settings.
                </div>
            )}
        </div>
    );
};

export default VoiceOnboarding; 