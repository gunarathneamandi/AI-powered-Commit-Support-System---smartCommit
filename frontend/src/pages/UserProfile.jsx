import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { getUserById, updateUser } from "../services/UserServices";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import ErrorAlert from "../components/ErrorAllert";
import SuccessMSG from "../components/SuccessMSG";

const UserProfile = () => {
  const { userId } = useParams();
  const [err, setErr] = useState("");
  const [smsg, setSmsg] = useState("");

  const [user, setUser] = useState({
    username: "",
    contact: "",
    email: "",
    password: "",
  });

  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userData = await getUserById(userId);
      if (userData) {
        setUser(userData);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleUpdateClick = () => {
    setIsEditable(!isEditable);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedUser = {
        username: user.username,
        contact: user.contact,
        email: user.email,
        password: user.password,
      };

      // Get the token from localStorage
      const token = localStorage.getItem("access_token");

      if (!token) {
        setSmsg("");
        setErr("User is not authenticated");
        return;
      }

      // ✅ Pass token to service function
      const response = await updateUser(userId, updatedUser, token);
      if (response) {

        setErr("");
        setSmsg("User updated successfully!");

        setIsEditable(false);
      }
    } catch (error) {
      setSmsg("");
      setErr("Failed to update user. Please check the input and try again.");
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="w-1/6 bg-gradient-to-br from-[#69A2AD] to-[#7315E7] border-r-3 border-[#858585] flex justify-center">
        <SideBar />
      </div>

      <div className="w-5/6 bg-gradient-to-br from-[#7315E7] to-[#69A2AD] flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-3/5">
          {err && (
            <div>
              <ErrorAlert message={err} />
            </div>
          )}
          {smsg && (
            <div>
              <SuccessMSG message={smsg} />
            </div>
          )}
          <div className="flex justify-center mb-6">
            <FaUserCircle className="text-6xl text-purple-500" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">
                User Name:
              </label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="w-2/3 bg-purple-100 text-gray-700 py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                readOnly={!isEditable}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">
                Contact Number:
              </label>
              <input
                type="text"
                value={user.contact}
                onChange={(e) => setUser({ ...user, contact: e.target.value })}
                className="w-2/3 bg-purple-100 text-gray-700 py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                readOnly={!isEditable}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">
                E-mail:
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-2/3 bg-purple-100 text-gray-700 py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                readOnly={!isEditable}
              />
            </div>

            {/* Password field is commented out, keeping it consistent */}
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handleUpdateClick}
              className={`py-2 px-8 rounded-full font-semibold transition shadow-md ${
                isEditable
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isEditable ? "Cancel" : "Update"}
            </button>
            {isEditable && (
              <button
                className="bg-green-600 text-white py-2 px-8 rounded-full font-semibold hover:bg-green-700 transition shadow-md"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
