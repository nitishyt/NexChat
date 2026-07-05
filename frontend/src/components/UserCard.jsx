import React, { useState } from "react";
import {
  MapPinIcon,
  UserPlus,
  Clock,
  MessageCircleMore,
  UserCheckIcon,
  UserMinus,
} from "lucide-react";
import { getCountryFlag } from "../constraints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequest, removeFriend } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserCard = ({
  user,
  outgoingRequestIds = new Set(),
  isConnected = false,
  onAccept,
  isPendingAccept,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const isSent = outgoingRequestIds.has(user._id);
  const showChatAction = isConnected;

  // Send Friend Request
  const { mutate, isPending } = useMutation({
    mutationFn: () => sendFriendRequest(user._id),

    onSuccess: () => {
      toast.success(`Friend request sent to ${user.fullName}`);
      queryClient.invalidateQueries({
        queryKey: ["outgoingRequests"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to send request"
      );
    },
  });

  // Remove Friend
  const { mutate: removeConnection, isPending: isRemoving } = useMutation({
    mutationFn: () => removeFriend(user._id),

    onSuccess: (data) => {
      toast.success(data.message);

      setShowRemoveModal(false);

      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recommendedUsers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["outgoingRequests"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to remove friend"
      );
    },
  });

  return (
    <>
      <div className="card bg-base-200 border border-base-300 shadow-sm card-sm flex flex-col">
        <div className="card-body">
          <div>
            <div className="flexBetween mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.image}
                  alt={user.fullName}
                  className="size-14 rounded-full object-cover"
                />

                <div>
                  <h5>{user.fullName}</h5>

                  {user.location && (
                    <p className="para flex items-center gap-2 mt-1">
                      <MapPinIcon height={16} width={16} />
                      {user.location}
                    </p>
                  )}
                </div>
              </div>

              {onAccept ? (
                <button
                  className="btn btn-xs btn-soft btn-success"
                  onClick={onAccept}
                  disabled={isPendingAccept}
                >
                  {isPendingAccept ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <>
                      <UserCheckIcon height={14} width={14} />
                      Accept
                    </>
                  )}
                </button>
              ) : showChatAction ? (
                <div className="flex gap-2">
                  <button
                    className="btn btn-xs btn-soft btn-success"
                    onClick={() => navigate(`/chat/${user._id}`)}
                  >
                    <MessageCircleMore size={16} />
                    Chat
                  </button>

                  <button
                    className="btn btn-xs btn-soft btn-error"
                    onClick={() => setShowRemoveModal(true)}
                    disabled={isRemoving}
                  >
                    {isRemoving ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <>
                        <UserMinus size={16} />
                        Remove
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  className={`btn btn-xs btn-soft ${
                    isSent ? "btn-warning" : "btn-info"
                  }`}
                  onClick={() => mutate()}
                  disabled={isSent || isPending}
                >
                  {isPending ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : isSent ? (
                    <>
                      <Clock size={14} />
                      Pending
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Connect
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="para">{user.bio}</p>
          </div>

          <hr className="h-px w-full bg-base-content opacity-10 rounded-full border-none mb-2" />

          <div className="flex flex-wrap gap-3">
            <span className="badge badge-soft badge-secondary text-xs font-medium capitalize">
              <img
                src={getCountryFlag(user.language)}
                alt={user.language}
                className="w-4 h-3 object-cover rounded-sm"
              />
              {user.language}
            </span>

            <span className="badge badge-soft badge-secondary text-xs font-medium capitalize">
              <span className="hidden sm:block">Skill:</span>
              {user.skill}
            </span>
          </div>
        </div>
      </div>

      {/* Remove Friend Modal */}
      {showRemoveModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Remove Connection
            </h3>

            <p className="py-4">
              Are you sure you want to remove{" "}
              <span className="font-semibold">
                {user.fullName}
              </span>{" "}
              from your connections?
            </p>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowRemoveModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-error"
                disabled={isRemoving}
                onClick={() => removeConnection()}
              >
                {isRemoving ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>

          <div
            className="modal-backdrop"
            onClick={() => setShowRemoveModal(false)}
          />
        </div>
      )}
    </>
  );
};

export default UserCard;