
import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const VideoCall = () => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadJitsiScript = () => {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = initJitsi;
      document.body.appendChild(script);
    };

    const initJitsi = () => {
      if (!jitsiContainerRef.current) return;

      const domain = "meet.jit.si";
      const options = {
        roomName: `teacherfinder-${teacherId}-${Date.now()}`,
        width: "100%",
        height: "100%",
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: user?.user_metadata?.full_name || user?.email || "Student"
        },
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'tileview'
          ],
        }
      };

      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      jitsiApiRef.current.on('readyToClose', () => {
        navigate(-1);
      });
    };

    loadJitsiScript();

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, [teacherId, navigate, user]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Card className="w-full h-[calc(100vh-2rem)] m-4 relative">
      <Button
        variant="outline"
        className="absolute top-4 left-4 z-10"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div ref={jitsiContainerRef} className="w-full h-full" />
    </Card>
  );
};

export default VideoCall;
