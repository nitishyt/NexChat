import { MessageSimple } from "stream-chat-react";
import { useNavigate } from "react-router-dom";

export default function CustomMessage(props) {
  const navigate = useNavigate();

  const text = props.message.text || "";

  if (text.startsWith("VIDEO_CALL:")) {
    const callId = text.replace("VIDEO_CALL:", "");

    return (
      <div className="p-3 rounded-lg bg-base-200 border border-base-300 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📹</span>
          <span className="font-semibold">Video Call Invitation</span>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/call/${callId}`)}
        >
          Join Call
        </button>
      </div>
    );
  }

  return <MessageSimple {...props} />;
}