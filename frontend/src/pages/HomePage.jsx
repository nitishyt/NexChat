import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOutgoingFriendRequests,
  getRecommendedUsers,
  getUserFriends,
} from "../../lib/api";
import NoFriendsFound from "../components/NoFriendsFound";
import NoRecommendedUsersFound from "../components/NoRecommendedUsersFound";
import UserCard from "../components/UserCard";

function HomePage() {
  console.log("Rendering HomePage");
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendRequests = [] } = useQuery({
    queryKey: ["outgoingRequests"],
    queryFn: getOutgoingFriendRequests,
  });

  const outgoingRequestIds = useMemo(() => {
    return new Set(outgoingFriendRequests.map((req) => req.recipient?._id));
  }, [outgoingFriendRequests]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return recommendedUsers;

    const query = search.toLowerCase();

    return recommendedUsers.filter((user) => {
      return (
        user.fullName?.toLowerCase().includes(query) ||
        user.skill?.toLowerCase().includes(query) ||
        user.language?.toLowerCase().includes(query) ||
        user.location?.toLowerCase().includes(query)
      );
    });
  }, [recommendedUsers, search]);

  return (
    <div className="space-y-11 h-[97vh] overflow-y-scroll">
      {/* Friends Section */}
      <section>
        <div className="mb-6">
          <h3>Learning Friends</h3>
          <p className="para">
            Connect with your learning peers and collaborate on projects.
          </p>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-xl p-4">
          {loadingFriends ? (
            <div className="flexCenter py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((user) => (
                <UserCard key={user._id} user={user} isConnected />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Expand Connections */}
      <section>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3>Expand Connections</h3>
            <p className="para">
              Connect with your learning peers and collaborate on projects.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search recommended users..."
            className="input input-bordered w-full md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-base-100 border border-base-300 rounded-xl p-4">
          {loadingUsers ? (
            <div className="flexCenter py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <NoRecommendedUsersFound />
          ) : filteredUsers.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-base-content/60">
                No recommended users found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  outgoingRequestIds={outgoingRequestIds}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;