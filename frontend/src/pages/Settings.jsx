import React, {
  useState,
} from "react";

import "./Settings.css";

import {
  ArrowLeft,
  Moon,
  Bell,
  Lock,
  Globe,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

const Settings = () => {

  const navigate =
    useNavigate();

  /* DARK MODE */

  const [
    darkMode,
    setDarkMode,
  ] = useState(false);

  /* PASSWORD MODAL */

  const [
    showPasswordModal,
    setShowPasswordModal,
  ] = useState(false);

  return (

    <section className="settings-page">

      {/* HEADER */}

      <div className="settings-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate(-1)
          }
        >

          <ArrowLeft size={22} />

        </button>

        <h1>
          Settings
        </h1>

      </div>

      {/* SETTINGS CARD */}

      <div className="settings-card">

        {/* DARK MODE */}

        <div className="setting-item">

          <Moon size={20} />

          <span>
            Dark Mode
          </span>

          <input
            type="checkbox"
            checked={darkMode}
            onChange={() =>
              setDarkMode(
                !darkMode
              )
            }
          />

        </div>

        {/* NOTIFICATIONS */}

        <div className="setting-item">

          <Bell size={20} />

          <span>
            Notifications
          </span>

          <input
            type="checkbox"
            defaultChecked
          />

        </div>

        {/* LANGUAGE */}

        <div className="setting-item">

          <Globe size={20} />

          <span>
            Language
          </span>

          <select>

            <option>
              English
            </option>

            <option>
              Sinhala
            </option>

          </select>

        </div>

        {/* PASSWORD */}

        <div className="setting-item">

          <Lock size={20} />

          <span>
            Change Password
          </span>

          <button
            onClick={() =>
              setShowPasswordModal(
                true
              )
            }
          >

            Update

          </button>

        </div>

      </div>

      {/* PASSWORD MODAL */}

      {showPasswordModal && (

        <div className="modal-overlay">

          <div className="password-modal">

            <h2>
              Change Password
            </h2>

            <input
              type="password"
              placeholder="Current Password"
            />

            <input
              type="password"
              placeholder="New Password"
            />

            <input
              type="password"
              placeholder="Confirm Password"
            />

            <div className="modal-buttons">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowPasswordModal(
                    false
                  )
                }
              >

                Cancel

              </button>

              <button
                className="save-btn"
                onClick={() => {

                  alert(
                    "Password Updated Successfully 😄"
                  );

                  setShowPasswordModal(
                    false
                  );

                }}
              >

                Save

              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};

export default Settings;